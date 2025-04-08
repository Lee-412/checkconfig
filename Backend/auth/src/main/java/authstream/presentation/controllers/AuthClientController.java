package authstream.presentation.controllers;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import authstream.application.services.AuthService;
import authstream.application.services.PerminssionClientService;
import authstream.application.services.RouteService;
import authstream.application.services.kv.TokenStoreService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/authstream")
public class AuthClientController {

    private static final String BACKEND_SERVER = "http://127.0.0.0:8081";
    private static final Logger logger = LoggerFactory.getLogger(RouteService.class);
    private final AuthService authService;
    private final PerminssionClientService perminssionClientService;

    public AuthClientController(AuthService authService, PerminssionClientService perminssionClientService1) {
        this.authService = authService;
        this.perminssionClientService = perminssionClientService1;
    }

    @GetMapping("/concurrentHashMap")
    public ResponseEntity<Map<String, Object>> getAllTokens() {
        Map<String, Object> response = new HashMap<>();

        TokenStoreService.getAllTokenEntries().forEach((key, entry) -> {
            Map<String, Object> tokenData = new HashMap<>();
            // tokenData.put("body", entry.getMessage().getBody());
            // tokenData.put("createdAt", entry.getCreatedAt());
            // tokenData.put("expiredAt", entry.getExpired());
            // tokenData.put("remainingTTL", entry.getRemainingTTL());
            // tokenData.put("isExpired", entry.isExpired());

            response.put(key, tokenData);
        });

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/permissioncheck/backup", method = { RequestMethod.GET, RequestMethod.POST,
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH })
    public ResponseEntity<Map<String, Object>> checkPermissionBackup(
            @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
            @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader,
            @RequestBody(required = false) Object requestBody) {
        Map<String, Object> requestBodyMap = convertRequestBodyToMap(requestBody);

        if (isLoginRequest(originalUri)) {
            return handleLoginRequest(requestBodyMap, authHeader);
        }
        try {
            Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                    originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

            if (processedBody.getRight() != null) {
                logger.warn("Permission denied: {}", processedBody.getRight());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(requestBodyMap);
            } else {
                requestBodyMap.put("authData", processedBody.getLeft());
                String url = BACKEND_SERVER + originalUri;
                ObjectMapper mapper = new ObjectMapper();
                String jsonBody = mapper.writeValueAsString(requestBodyMap);
                HttpRequest httpRequest = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .method(originalMethod.toUpperCase(), HttpRequest.BodyPublishers.ofString(jsonBody))
                        .header("Content-Type", "application/json")
                        .build();

                HttpClient client = HttpClient.newHttpClient();
                HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());

                ObjectMapper responseMapper = new ObjectMapper();
                try {
                    Map<String, Object> backendJson = responseMapper.readValue(response.body(), new TypeReference<>() {
                    });
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body(backendJson);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("Deo on roi em oi", response.body()));
                }
            }
        } catch (Exception e) {
            logger.error("Error processing permission request", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);
        }

    }

    @RequestMapping(value = "/permissioncheck", method = { RequestMethod.GET, RequestMethod.POST,
            RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH })
    public ResponseEntity<Map<String, Object>> checkPermission(
            @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
            @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader,
            @RequestBody(required = false) Object requestBody) {

        logger.debug("Processing permission check request: URI={}, Method={}", originalUri, originalMethod);
        System.out.println("djt auth auth ban dau");

        System.out.println(authHeader);
        Map<String, Object> requestBodyMap = convertRequestBodyToMap(requestBody);
        System.out.println("Dcm anh yeu dav " + requestBodyMap.toString());
        System.out.println(originalUri);

        if (isLoginRequest(originalUri)) {
            System.out.println("dcm method is login");
            System.out.println(originalUri);
            return handleLoginRequest(requestBodyMap, authHeader);
        }

        try {
            Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                    originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

            if (processedBody.getRight() != null) {
                logger.warn("Permission denied: {}", processedBody.getRight());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(requestBodyMap);
            } else {
                requestBodyMap.put("authData", processedBody.getLeft());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            }
        } catch (Exception e) {
            logger.error("Error processing permission request", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> convertRequestBodyToMap(Object requestBody) {
        if (requestBody == null) {
            return new HashMap<>();
        }

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> requestBodyMap = new HashMap<>();

        try {
            if (requestBody instanceof String) {
                requestBodyMap = objectMapper.readValue((String) requestBody,
                        new TypeReference<Map<String, Object>>() {
                        });
            } else if (requestBody instanceof Map) {
                requestBodyMap = (Map<String, Object>) requestBody;
            } else {
                logger.warn("Unexpected requestBody type: {}", requestBody.getClass().getName());
            }
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse request body", e);
        }

        return requestBodyMap;
    }

    private boolean isLoginRequest(String uri) {
        return uri != null && uri.contains("/login");
    }

    @Cacheable(value = "login", key = "#username + '-' + #token")
    private ResponseEntity<Map<String, Object>> handleLoginRequest(Map<String, Object> requestBodyMap,
            String authHeader) {
        String username = (String) requestBodyMap.get("username");
        String password = (String) requestBodyMap.get("password");

        String token = null;

        System.out.println(authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (username == null || password == null) {
            logger.warn("Login attempt with missing credentials");
            return ResponseEntity.badRequest().body(requestBodyMap);
        }

        try {
            Pair<Object, Object> authResult = authService.login(username, password, token);

            if (authResult.getRight() != null) {
                logger.info("Authentication failed for user: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);
            }

            requestBodyMap.put("authData", authResult.getLeft());
            logger.info("Authentication successful for user: {}", username);
            System.out.println("requestBodyMap");

            System.out.println(requestBodyMap.toString()    );
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
        } catch (Exception e) {
            logger.error("Authentication error for user: {}", username, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);
        }
    }
}