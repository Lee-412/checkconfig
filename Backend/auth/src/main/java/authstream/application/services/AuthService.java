package authstream.application.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.tuple.Pair;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import authstream.application.services.hashing.HashingService;
import authstream.application.services.hashing.HashingType;
import authstream.application.services.jwt.JwtService;
import authstream.application.services.jwt.TokenResponse;
import authstream.application.services.kv.TokenEntry;
import authstream.application.services.kv.TokenEntry.Message;
import authstream.application.services.kv.TokenStoreService;
import authstream.domain.entities.AuthTableConfig;
import authstream.infrastructure.repositories.AuthTableConfigRepository;
import authstream.utils.AuthUtils;;

@Service
public class AuthService {

    private final AuthTableConfigRepository authConfigRepository;
    private final JdbcTemplate jdbcTemplate;
    private static final Logger logger = LoggerFactory.getLogger(RouteService.class);

    public AuthService(AuthTableConfigRepository authConfigRepository, JdbcTemplate jdbcTemplate) {
        this.authConfigRepository = authConfigRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public Pair<Object, Object> login(String username, String password, String token) throws Exception {
        AuthTableConfig config = authConfigRepository.findFirst();

        if (config == null) {
            // throw new IllegalStateException("Auth configuration not found");
            return Pair.of(null, "Auth configuration not found");
        }

        String userTable = config.getUserTable();
        String passwordAttribute = config.getPasswordAttribute();
        HashingType hashingType = config.getHashingType();
        Object hashConfig = AuthUtils.parseHashConfigFromJson(config.getHashConfig(), hashingType);

        long startTime = System.nanoTime();

        String hashedInput = HashingService.hash(password, hashingType, hashConfig);
        long endTime = System.nanoTime();
        long duration = (endTime - startTime) / 1_000_000; // Convert from nanoseconds to milliseconds
        System.out.println("Password hashing took: " + duration + " milliseconds.");
        startTime = System.nanoTime();
        String storedHash = AuthUtils.fetchUserPassword(username, userTable, passwordAttribute, jdbcTemplate);
        duration = (System.nanoTime() - startTime) / 1_000_000;
        System.out.println("Fetching user password took: " + duration + " milliseconds.");
        System.out.println("storedHash: " + storedHash);
        if (storedHash == null) {
            // throw new IllegalArgumentException("User not found");
            return Pair.of(null, "User not found");

        }

        if (hashingType == HashingType.BCRYPT) {
            startTime = System.nanoTime();
            boolean matches = BCrypt.checkpw(password, storedHash);
            System.out.println((System.nanoTime() - startTime) / 1_000_000 + " Check hash");
            System.out.println("Password matches: " + matches);
            if (!matches) {
                // throw new IllegalArgumentException("Invalid username or password");
                return Pair.of(null, "Invalid username or password");

            }
        } else if (!storedHash.equals(hashedInput)) {
            // throw new IllegalArgumentException("Invalid username or password");
            return Pair.of(null, "Invalid username or password");

        }

        // Check token từ header
        System.out.println("Token received: " + token);
        if (token != null && !token.isEmpty()) {
            TokenEntry existingEntry = TokenStoreService.read(token);

            System.out.println("Existing entry: " + (existingEntry != null ? existingEntry.toString() : "null"));
            if (existingEntry != null && !existingEntry.isExpired()) {
                System.out.println("Token expired: " + existingEntry.isExpired());
                System.out.println("Username in token: " + existingEntry.getMessage().getBody());
                String tokenBody = existingEntry.getMessage().getBody().toString();
                // Kiểm tra xem tokenBody có chứa "username":"banlamdoan" không
                if (tokenBody.contains("\"username\":\"" + username + "\"")) {
                    System.out.println("Returning existing token");
                    // return AuthUtils.buildTokenResponse(token, existingEntry, "Using existing
                    // token");
                    return Pair.of(existingEntry, null);
                } else {
                    throw new IllegalArgumentException("Token does not belong to this user");
                }
            }
        }

        System.out.println("Generating new token");
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("password", password);
        String secretKey = "mySuperSecretKey1234567890123456";
        long ttlSeconds = 3600;

        Map<String, String> tokenBody = new HashMap<>();
        tokenBody.put("username", username);
        TokenEntry tokenEntry = new TokenEntry(
                new TokenEntry.Message(new ObjectMapper().writeValueAsString(claims)),
                Instant.now(),
                Instant.now().plusSeconds(3600));
                String newToken = JwtService.createToken(claims, secretKey, ttlSeconds).getToken();

        System.out.println(newToken);
        System.out.println(TokenStoreService.create(newToken, tokenEntry));

        return Pair.of(newToken, null);
    }

    

    public static void main(String[] args) {
        String password = "pass123";
        String salt = "$2a$12$Gbe4AzAQpfwu5bYRWhpiD.";
        String hash = BCrypt.hashpw(password, salt);
        System.out.println("Generated hash: " + hash);
        boolean matches = BCrypt.checkpw(password, hash);
        System.out.println("Matches with generated hash: " + matches);
        boolean matchesWithStored = BCrypt.checkpw(password,
                "$2a$12$Gbe4AzAQpfwu5bYRWhpiD.GraMcNnFJLnB914N2yEZsZCE6C.1wa6");
        System.out.println("Matches with stored hash: " + matchesWithStored);
    }

}