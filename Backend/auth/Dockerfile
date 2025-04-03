# # Stage 1: Build the application using Maven
# FROM maven:3.9-eclipse-temurin-21 AS builder
# WORKDIR /
# # Copy the Maven project files
# COPY ./pom.xml .
# COPY ./src ./src
# # Build the application (this will generate the JAR file in the target directory)
# RUN mvn clean package -DskipTests

# # Stage 2: Create the runtime image
# FROM eclipse-temurin:21-jre-jammy
# WORKDIR /
# # Copy the JAR file from the builder stage
# COPY --from=builder /target/*.jar app.jar
# EXPOSE 8082
# ENTRYPOINT ["./mvnw", "spring-boot:run"n


# Dùng image Maven có Java 21
FROM maven:3.9-eclipse-temurin-21

# Set working directory
WORKDIR /app

# Copy toàn bộ project (bao gồm mvnw, pom.xml, src)
COPY . .

# Đảm bảo mvnw có quyền thực thi
RUN chmod +x ./mvnw

# Expose port 8082
EXPOSE 8082

# Chạy ứng dụng bằng mvnw
ENTRYPOINT ["./mvnw", "spring-boot:run"]