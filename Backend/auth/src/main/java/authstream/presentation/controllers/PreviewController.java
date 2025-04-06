package authstream.presentation.controllers;

import java.sql.SQLException;
import java.util.List;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import authstream.application.dtos.AdminDto;
import authstream.application.dtos.PreviewDataRequestDto;
import authstream.application.services.db.DatabaseClass;
import authstream.application.services.db.DatabaseClass.Table;
import authstream.application.services.db.DatabaseClass.TableData;
import authstream.application.services.db.DatabaseConnectionService;
import authstream.application.services.db.DatabasePreviewService;
import authstream.application.services.db.DatabaseSchema;
import authstream.utils.ValidStringDb;
import authstream.utils.validString;

@RestController
@RequestMapping("/previews")
public class PreviewController {

    private ResponseEntity<?> validateAndGetConnectionString(AdminDto adminDto) {
        String connectionString = adminDto.getConnectionString();
        if (connectionString != null && !connectionString.isEmpty()) {
            if (ValidStringDb.checkConnectionString(connectionString)) {
                return new ResponseEntity<>(connectionString, HttpStatus.OK);
            }
        }

        Pair checkValid = validString.checkValidData(adminDto);
        if (!(boolean) checkValid.getRight()) {
            return new ResponseEntity<>(checkValid.getLeft().toString(), HttpStatus.BAD_REQUEST);
        }

        try {
            // connectionString = validString.buildConnectionString(adminDto);
            connectionString = "";
            return new ResponseEntity<>(connectionString, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    
        //           Pair<String, Boolean> resultConnectionString = validString.buildConnectionString(adminDto);
        // if(resultConnectionString.getRight()){
        //     return new  ResponseEntity<>(connectionString, HttpStatus.OK);
        // }
        // else {
        //     return new ResponseEntity<>(resultConnectionString.getLeft(), HttpStatus.BAD_REQUEST);
        // }
    }



    @PostMapping("/checkconnection")
    public ResponseEntity<String> checkConnection(@RequestBody AdminDto adminDto) {
        try {
            String connectionString ="";
            System.out.println("chcek adminDto" );

            System.out.println(adminDto.getConnectionString());        
                if (adminDto.getConnectionString().isEmpty()) {
                System.out.println("vailid vailon Conncetion");
                Pair<String, Object> connectionStringPair = validString.buildConnectionStringData(adminDto);
                System.out.println("vailid vailon Pair" +connectionStringPair);
                if (connectionStringPair.getRight() != null) {
                    // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    //         .body(connectionStringPair.getRight().toString());
                    System.out.println("vailid vailon Pair" +connectionStringPair);

                }
                connectionString = connectionStringPair.getLeft();
                System.out.println("vailid vailon Connection String build" +connectionString);

            }
            else {
                connectionString = adminDto.getConnectionString();
            }
            System.out.println("chcek Connetion" );

            System.out.println(connectionString);
            Pair<Boolean, String> result = DatabaseConnectionService.checkDatabaseConnection(connectionString);
            if (result.getLeft() == false) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result.getRight());
            }

            return ResponseEntity.status(HttpStatus.OK).body(result.getRight());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database Connection: " + e.getMessage());

        }
    }

    @PostMapping("/viewschema")
    public ResponseEntity<?> viewSchema(@RequestBody AdminDto adminDto) {
        try {
            String connectionString ="";
            System.out.println("chcek adminDto" );

            System.out.println(adminDto.getConnectionString());        
                if (adminDto.getConnectionString().isEmpty()) {
                System.out.println("vailid vailon Conncetion");
                Pair<String, Object> connectionStringPair = validString.buildConnectionStringData(adminDto);
                System.out.println("vailid vailon Pair" +connectionStringPair);
                if (connectionStringPair.getRight() != null) {
                    // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    //         .body(connectionStringPair.getRight().toString());
                    System.out.println("vailid vailon Pair" +connectionStringPair);

                }
                connectionString = connectionStringPair.getLeft();
                System.out.println("vailid vailon Connection String build" +connectionString);

            }
            else {
                connectionString = adminDto.getConnectionString();
            }
            System.out.println("chcek Connetion" );

            System.out.println(connectionString);
            DatabaseClass.Schema schema = DatabaseSchema.viewSchema(connectionString);
            
            return new ResponseEntity<>(schema, HttpStatus.OK);
        } catch (SQLException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/preview-data")
    public ResponseEntity<?> previewData(@RequestBody PreviewDataRequestDto request) {
        try {
            System.out.println("Vailon");
            System.out.println(request);

            if (request == null || request.getConnectionString() == null || request.getTables() == null) {
                return ResponseEntity.badRequest().body("Invalid request: connectionString and tables are required");
            }

            List<Table> tables = request.getTables();
            for (Table table : tables) {
                if (table.getTableName() == null || table.getTableName().isEmpty()) {
                    return ResponseEntity.badRequest().body("Invalid request: tableName is required for all tables");
                }
            }

            List<TableData> previewData = DatabasePreviewService.previewData(
                    request.getConnectionString(),
                    tables,
                    request.getLimit() != null ? request.getLimit() : 10,
                    request.getOffset() != null ? request.getOffset() : 0
            );

            return ResponseEntity.ok(previewData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}