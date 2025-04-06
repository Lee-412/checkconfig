package authstream.application.services.db;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.tuple.Pair;

import authstream.application.dtos.ApiResponse;

public class DataReplicationService {
    public static Pair<Boolean, String> replicateData(String sourceConnectionString,
            String destinationConnectionString, List<String> TableNames) {
        try (Connection sourceConn = DriverManager.getConnection(sourceConnectionString);
                Connection destConn = DriverManager.getConnection(destinationConnectionString)) {

            DatabaseMetaData sourceMetaData = sourceConn.getMetaData();
            ResultSet tables = sourceMetaData.getTables(null, null, "%", new String[] { "TABLE" });
            List<String> allTableNames = new ArrayList<>();

            while (tables.next()) {
                allTableNames.add(tables.getString("TABLE_NAME"));
            }
            tables.close();

            if (allTableNames.isEmpty()) {
                return Pair.of(false, "No tables found in source database");
            }

            // Determine which tables to replicate
            List<String> tablesToReplicate;
            if (TableNames == null || TableNames.isEmpty()) {
                tablesToReplicate = allTableNames; // Replicate all tables if no specific list is provided
            } else {
                tablesToReplicate = new ArrayList<>();
                for (String requestedTable : TableNames) {
                    for (String existingTable : allTableNames) {
                        if (existingTable.equalsIgnoreCase(requestedTable)) {
                            tablesToReplicate.add(existingTable);
                            break;
                        }
                    }
                }
                if (tablesToReplicate.isEmpty()) {
                    return Pair.of(false, "None of the specified tables (" + String.join(", ", TableNames)
                            + ") exist in the source database");
                }
            }

            Statement destStmt = destConn.createStatement();
            for (String tableName : tablesToReplicate) {
                try {
                    destStmt.execute("DROP TABLE IF EXISTS " + tableName + " CASCADE");
                } catch (SQLException e) {
                    return Pair.of(false, "Failed to drop table " + tableName + " in destination: " + e.getMessage());
                }

                ResultSet columns = sourceMetaData.getColumns(null, null, tableName, "%");
                StringBuilder createTableSql = new StringBuilder("CREATE TABLE " + tableName + " (");
                List<String> columnDefs = new ArrayList<>();
                List<String> primaryKeys = new ArrayList<>();

                while (columns.next()) {
                    String columnName = columns.getString("COLUMN_NAME");
                    String columnType = columns.getString("TYPE_NAME");
                    int columnSize = columns.getInt("COLUMN_SIZE");
                    String nullable = columns.getString("IS_NULLABLE");

                    String columnDef = columnName + " " + columnType;
                    if (columnSize > 0 && columnType.toUpperCase().contains("CHAR")) {
                        columnDef += "(" + columnSize + ")";
                    }
                    if ("NO".equalsIgnoreCase(nullable)) {
                        columnDef += " NOT NULL";
                    }
                    columnDefs.add(columnDef);
                }
                columns.close();

                ResultSet pk = sourceMetaData.getPrimaryKeys(null, null, tableName);
                while (pk.next()) {
                    primaryKeys.add(pk.getString("COLUMN_NAME"));
                }
                pk.close();
                if (!primaryKeys.isEmpty()) {
                    columnDefs.add("PRIMARY KEY (" + String.join(", ", primaryKeys) + ")");
                }

                createTableSql.append(String.join(", ", columnDefs)).append(")");
                try {
                    destStmt.execute(createTableSql.toString());
                } catch (SQLException e) {
                    return Pair.of(false, "Failed to create table " + tableName + " in destination: " + e.getMessage());
                }

                String selectQuery = "SELECT * FROM " + tableName;
                try (PreparedStatement sourceStmt = sourceConn.prepareStatement(selectQuery);
                        ResultSet rs = sourceStmt.executeQuery()) {

                    int columnCount = rs.getMetaData().getColumnCount();
                    String insertQuery = "INSERT INTO " + tableName + " VALUES (" + "?, ".repeat(columnCount - 1)
                            + "?)";
                    try (PreparedStatement insertStmt = destConn.prepareStatement(insertQuery)) {
                        while (rs.next()) {
                            for (int i = 1; i <= columnCount; i++) {
                                insertStmt.setObject(i, rs.getObject(i));
                            }
                            insertStmt.addBatch();
                        }
                        insertStmt.executeBatch();
                    }
                } catch (SQLException e) {
                    return Pair.of(false, "Failed to copy data for table " + tableName + ": " + e.getMessage());
                }
            }

            destStmt.close();
            return Pair.of(true, "Successfully replicated tables: " + String.join(", ", tablesToReplicate));

        } catch (SQLException e) {
            ApiResponse result = new ApiResponse(false, "Failed to copy data for table: " + e.getMessage());
            return Pair.of(result.getData().equals(true), result.getMessage());
        }
    }

    public static void main(String[] args) {
        String destination = "jdbc:postgresql://localhost:5432/?user=postgres&password=123456";
        // String source =
        // "jdbc:postgresql://ep-snowy-fire-a831dkmt.eastus2.azure.neon.tech:5432/Linglooma"
        // +
        // "?user=Linglooma_owner" +
        // "&password=npg_KZsn7Wl3LOdu" +
        // "&sslmode=require";
        String source = "jdbc:postgresql://ep-snowy-fire-a831dkmt.eastus2.azure.neon.tech:5432/Linglooma?user=Linglooma_owner&password=npg_KZsn7Wl3LOdu&sslmode=require";

        List<String> tablesToReplicate = List.of("users", "items", "vipitems"); // Example table names
        Pair<Boolean, String> result = replicateData(source, destination, tablesToReplicate);

        if (result.getLeft()) {
            System.out.println("Data replication successful: " + result.getRight());
        } else {
            System.err.println("Data replication failed: " + result.getRight());
        }
    }
}