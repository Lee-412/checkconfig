package authstream.presentation.controllers;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import authstream.application.services.AuthService;
import authstream.application.services.PerminssionClientService;
import authstream.application.services.RouteService;

@RestController
@RequestMapping("/authstream")
public class AuthClientController {

    private static final Logger logger = LoggerFactory.getLogger(RouteService.class);
    private final AuthService authService;
    private final PerminssionClientService perminssionClientService;

    public AuthClientController(AuthService authService, PerminssionClientService perminssionClientService1) {
        this.authService = authService;
        this.perminssionClientService = perminssionClientService1;
    }

    // @PostMapping("/login")
    // public ResponseEntity<Map<String, Object>> login(
    // @RequestBody Map<String, Object> requestBody,
    // @RequestHeader(value = "Authorization", required = false) String token) {
    // System.out.println("Header Authorization received in controller: " + token);
    // String username = (String) requestBody.get("username");
    // String password = (String) requestBody.get("password");

    // if (token != null && token.startsWith("Bearer ")) {
    // token = token.substring(7); // Lấy UUID sau "Bearer "
    // }

    // if (username == null || password == null) {
    // return ResponseEntity.badRequest().body(Map.of("message", "Username and
    // password required"));
    // }

    // try {
    // Pair<Object, Object> tokenInfo = authService.login(username, password,
    // token);
    // // return ResponseEntity.ok(tokenInfo);
    // if (tokenInfo.getRight() != null) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBody);
    // }
    // requestBody.put("authData", tokenInfo.getLeft());
    // return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBody);

    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message",
    // e.getMessage()));
    // }
    // }

    // @GetMapping("/validate")
    // public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String
    // token) {
    // try {
    // Map<String, Object> tokenInfo = authService.validateToken(token);
    // return ResponseEntity.ok(tokenInfo);
    // } catch (Exception e) {
    // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message",
    // e.getMessage()));
    // }
    // }

@PostMapping("/permissioncheck")
    public ResponseEntity<Map<String, Object>> checkPermission(
            @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
            @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestHeader(value = "Cookie", required = false) String cookieHeader,
            @RequestBody Object requestBody) {
        ObjectMapper objectMapper = new ObjectMapper();
   System.out.println("Anh yeu em ");
        System.out.println(cookieHeader);
        System.out.println("Anh nho em");
        System.out.println(requestBody);
        System.out.println(originalUri);
        System.out.println(originalMethod);
        System.out.println(authHeader);

        
        // In type của requestBody để debug
        System.out.println("Type of requestBody: " + (requestBody != null ? requestBody.getClass().getName() : "null"));

        // Logic chuyển từ Object sang Map<String, Object>
        Map<String, Object> requestBodyMap;
        try {
            if (requestBody == null) {
                // Trường hợp requestBody là null
                requestBodyMap = new HashMap<>();
                System.out.println("requestBody is null, returning empty map");
            } else if (requestBody instanceof String) {
                // Trường hợp requestBody là String (raw JSON)
                requestBodyMap = objectMapper.readValue((String) requestBody, new TypeReference<Map<String, Object>>() {
                });
                System.out.println("Parsed String to Map: " + requestBodyMap);
            } else if (requestBody instanceof Map) {
                // Trường hợp requestBody đã là Map (đã được deserialize)
                requestBodyMap = (Map<String, Object>) requestBody;
                System.out.println("Directly casted to Map: " + requestBodyMap);
            } else {
                // Trường hợp khác (không mong đợi), trả về map rỗng hoặc xử lý theo ý mày
                requestBodyMap = new HashMap<>();
                System.out.println("Unexpected type, returning empty map: " + requestBody.getClass().getName());
            }
        } catch (JsonProcessingException e) {
            // Xử lý lỗi khi parse JSON từ String
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Cannot parse requestBody to Map: " + e.getMessage());
            System.out.println("Error parsing JSON: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Logic xử lý với requestBodyMap (bây giờ là Map<String, Object>)
        System.out.println("Username: " + requestBodyMap.get("username"));
        System.out.println("Password: " + requestBodyMap.get("password"));

        // Tạo response
        // System.out.println(map.get("username"));
        System.out.println("Anh yeu em ");
        System.out.println(cookieHeader);
        System.out.println("Anh nho em");
        System.out.println(requestBody);
        System.out.println(originalUri);
        System.out.println(originalMethod);
        System.out.println(authHeader);
        // return null;
        try {
            logger.info("ditmethuadoiroi", requestBodyMap);
            if (requestBodyMap == null) {
                requestBodyMap = new HashMap<>();
            }
            System.out.println(requestBodyMap);
            String str2 = "/login";
            // if (requestBodyMap.containsKey("password")) {
            if (originalUri.toUpperCase().contains(str2.toUpperCase())) {

                String username = (String) requestBodyMap.get("username");
                String password = (String) requestBodyMap.get("password");
                
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
                }
                System.out.println("dit me thua doi roi co password"+authHeader);


                if (username == null || password == null) {
                    return ResponseEntity.badRequest()
                            .body(requestBodyMap);
                }

                try {
                    Pair<Object, Object> authHeaderInfo = authService.login(username, password,
                            authHeader);

                System.out.println("dit me thua doi roi co password, Pair"+authHeaderInfo);

                    if (authHeaderInfo.getRight() != null) {
                        System.out.println("dit me thua doi roi co password, Pair Right not null");

                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);

                    }
                    System.out.println("dit me thua doi roi co password, Pair Right not null");

                    requestBodyMap.put("authData", authHeaderInfo.getLeft());
                    System.out.println(requestBodyMap);
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(requestBodyMap);
                }
            }

            Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                    originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

                    System.out.println("processedBody: " + processedBody);
            if (processedBody.getRight() != null) {
                System.out.println(processedBody.getRight());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(requestBodyMap);
            } else {
                System.out.println(processedBody.getLeft());

                requestBodyMap.put("authData", processedBody.getLeft());
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            }

        } catch (Exception e) {
            logger.error("Error processing request: {}", requestBodyMap);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(requestBodyMap);
        } finally {
            logger.info("default body", requestBodyMap);
        }
    }





@GetMapping("/permissioncheck")
public ResponseEntity<Map<String, Object>> checkPermissionGet(
        @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
        @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
        @RequestHeader(value = "Authorization", required = false) String authHeader,
        @RequestHeader(value = "Cookie", required = false) String cookieHeader,
        @RequestBody Object requestBody) {
    ObjectMapper objectMapper = new ObjectMapper();
System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);

    
    // In type của requestBody để debug
    System.out.println("Type of requestBody: " + (requestBody != null ? requestBody.getClass().getName() : "null"));

    // Logic chuyển từ Object sang Map<String, Object>
    Map<String, Object> requestBodyMap;
    try {
        if (requestBody == null) {
            // Trường hợp requestBody là null
            requestBodyMap = new HashMap<>();
            System.out.println("requestBody is null, returning empty map");
        } else if (requestBody instanceof String) {
            // Trường hợp requestBody là String (raw JSON)
            requestBodyMap = objectMapper.readValue((String) requestBody, new TypeReference<Map<String, Object>>() {
            });
            System.out.println("Parsed String to Map: " + requestBodyMap);
        } else if (requestBody instanceof Map) {
            // Trường hợp requestBody đã là Map (đã được deserialize)
            requestBodyMap = (Map<String, Object>) requestBody;
            System.out.println("Directly casted to Map: " + requestBodyMap);
        } else {
            // Trường hợp khác (không mong đợi), trả về map rỗng hoặc xử lý theo ý mày
            requestBodyMap = new HashMap<>();
            System.out.println("Unexpected type, returning empty map: " + requestBody.getClass().getName());
        }
    } catch (JsonProcessingException e) {
        // Xử lý lỗi khi parse JSON từ String
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Cannot parse requestBody to Map: " + e.getMessage());
        System.out.println("Error parsing JSON: " + e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Logic xử lý với requestBodyMap (bây giờ là Map<String, Object>)
    System.out.println("Username: " + requestBodyMap.get("username"));
    System.out.println("Password: " + requestBodyMap.get("password"));

    // Tạo response
    // System.out.println(map.get("username"));
    System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);
    // return null;
    try {
        logger.info("ditmethuadoiroi", requestBodyMap);
        if (requestBodyMap == null) {
            requestBodyMap = new HashMap<>();
        }
        System.out.println(requestBodyMap);
        String str2 = "/login";
        // if (requestBodyMap.containsKey("password")) {
        if (originalUri.toUpperCase().contains(str2.toUpperCase())) {

            String username = (String) requestBodyMap.get("username");
            String password = (String) requestBodyMap.get("password");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
            }
            System.out.println("dit me thua doi roi co password"+authHeader);


            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(requestBodyMap);
            }

            try {
                Pair<Object, Object> authHeaderInfo = authService.login(username, password,
                        authHeader);

            System.out.println("dit me thua doi roi co password, Pair"+authHeaderInfo);

                if (authHeaderInfo.getRight() != null) {
                    System.out.println("dit me thua doi roi co password, Pair Right not null");

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);

                }
                System.out.println("dit me thua doi roi co password, Pair Right not null");

                requestBodyMap.put("authData", authHeaderInfo.getLeft());
                System.out.println(requestBodyMap);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(requestBodyMap);
            }
        }

        Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

                System.out.println("processedBody: " + processedBody);
        if (processedBody.getRight() != null) {
            System.out.println(processedBody.getRight());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(requestBodyMap);
        } else {
            System.out.println(processedBody.getLeft());

            requestBodyMap.put("authData", processedBody.getLeft());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
        }

    } catch (Exception e) {
        logger.error("Error processing request: {}", requestBodyMap);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(requestBodyMap);
    } finally {
        logger.info("default body", requestBodyMap);
    }
}


@PutMapping("/permissioncheck")
public ResponseEntity<Map<String, Object>> checkPermissionPut(
        @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
        @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
        @RequestHeader(value = "Authorization", required = false) String authHeader,
        @RequestHeader(value = "Cookie", required = false) String cookieHeader,
        @RequestBody Object requestBody) {
    ObjectMapper objectMapper = new ObjectMapper();
System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);

    
    // In type của requestBody để debug
    System.out.println("Type of requestBody: " + (requestBody != null ? requestBody.getClass().getName() : "null"));

    // Logic chuyển từ Object sang Map<String, Object>
    Map<String, Object> requestBodyMap;
    try {
        if (requestBody == null) {
            // Trường hợp requestBody là null
            requestBodyMap = new HashMap<>();
            System.out.println("requestBody is null, returning empty map");
        } else if (requestBody instanceof String) {
            // Trường hợp requestBody là String (raw JSON)
            requestBodyMap = objectMapper.readValue((String) requestBody, new TypeReference<Map<String, Object>>() {
            });
            System.out.println("Parsed String to Map: " + requestBodyMap);
        } else if (requestBody instanceof Map) {
            // Trường hợp requestBody đã là Map (đã được deserialize)
            requestBodyMap = (Map<String, Object>) requestBody;
            System.out.println("Directly casted to Map: " + requestBodyMap);
        } else {
            // Trường hợp khác (không mong đợi), trả về map rỗng hoặc xử lý theo ý mày
            requestBodyMap = new HashMap<>();
            System.out.println("Unexpected type, returning empty map: " + requestBody.getClass().getName());
        }
    } catch (JsonProcessingException e) {
        // Xử lý lỗi khi parse JSON từ String
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Cannot parse requestBody to Map: " + e.getMessage());
        System.out.println("Error parsing JSON: " + e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Logic xử lý với requestBodyMap (bây giờ là Map<String, Object>)
    System.out.println("Username: " + requestBodyMap.get("username"));
    System.out.println("Password: " + requestBodyMap.get("password"));

    // Tạo response
    // System.out.println(map.get("username"));
    System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);
    // return null;
    try {
        logger.info("ditmethuadoiroi", requestBodyMap);
        if (requestBodyMap == null) {
            requestBodyMap = new HashMap<>();
        }
        System.out.println(requestBodyMap);
        String str2 = "/login";
        // if (requestBodyMap.containsKey("password")) {
        if (originalUri.toUpperCase().contains(str2.toUpperCase())) {

            String username = (String) requestBodyMap.get("username");
            String password = (String) requestBodyMap.get("password");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
            }
            System.out.println("dit me thua doi roi co password"+authHeader);


            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(requestBodyMap);
            }

            try {
                Pair<Object, Object> authHeaderInfo = authService.login(username, password,
                        authHeader);

            System.out.println("dit me thua doi roi co password, Pair"+authHeaderInfo);

                if (authHeaderInfo.getRight() != null) {
                    System.out.println("dit me thua doi roi co password, Pair Right not null");

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);

                }
                System.out.println("dit me thua doi roi co password, Pair Right not null");

                requestBodyMap.put("authData", authHeaderInfo.getLeft());
                System.out.println(requestBodyMap);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(requestBodyMap);
            }
        }

        Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

                System.out.println("processedBody: " + processedBody);
        if (processedBody.getRight() != null) {
            System.out.println(processedBody.getRight());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(requestBodyMap);
        } else {
            System.out.println(processedBody.getLeft());

            requestBodyMap.put("authData", processedBody.getLeft());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
        }

    } catch (Exception e) {
        logger.error("Error processing request: {}", requestBodyMap);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(requestBodyMap);
    } finally {
        logger.info("default body", requestBodyMap);
    }
}



@DeleteMapping("/permissioncheck")
public ResponseEntity<Map<String, Object>> checkPermissionDelete(
        @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
        @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
        @RequestHeader(value = "Authorization", required = false) String authHeader,
        @RequestHeader(value = "Cookie", required = false) String cookieHeader,
        @RequestBody Object requestBody) {
    ObjectMapper objectMapper = new ObjectMapper();
System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);

    
    // In type của requestBody để debug
    System.out.println("Type of requestBody: " + (requestBody != null ? requestBody.getClass().getName() : "null"));

    // Logic chuyển từ Object sang Map<String, Object>
    Map<String, Object> requestBodyMap;
    try {
        if (requestBody == null) {
            // Trường hợp requestBody là null
            requestBodyMap = new HashMap<>();
            System.out.println("requestBody is null, returning empty map");
        } else if (requestBody instanceof String) {
            // Trường hợp requestBody là String (raw JSON)
            requestBodyMap = objectMapper.readValue((String) requestBody, new TypeReference<Map<String, Object>>() {
            });
            System.out.println("Parsed String to Map: " + requestBodyMap);
        } else if (requestBody instanceof Map) {
            // Trường hợp requestBody đã là Map (đã được deserialize)
            requestBodyMap = (Map<String, Object>) requestBody;
            System.out.println("Directly casted to Map: " + requestBodyMap);
        } else {
            // Trường hợp khác (không mong đợi), trả về map rỗng hoặc xử lý theo ý mày
            requestBodyMap = new HashMap<>();
            System.out.println("Unexpected type, returning empty map: " + requestBody.getClass().getName());
        }
    } catch (JsonProcessingException e) {
        // Xử lý lỗi khi parse JSON từ String
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Cannot parse requestBody to Map: " + e.getMessage());
        System.out.println("Error parsing JSON: " + e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Logic xử lý với requestBodyMap (bây giờ là Map<String, Object>)
    System.out.println("Username: " + requestBodyMap.get("username"));
    System.out.println("Password: " + requestBodyMap.get("password"));

    // Tạo response
    // System.out.println(map.get("username"));
    System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);
    // return null;
    try {
        logger.info("ditmethuadoiroi", requestBodyMap);
        if (requestBodyMap == null) {
            requestBodyMap = new HashMap<>();
        }
        System.out.println(requestBodyMap);
        String str2 = "/login";
        // if (requestBodyMap.containsKey("password")) {
        if (originalUri.toUpperCase().contains(str2.toUpperCase())) {

            String username = (String) requestBodyMap.get("username");
            String password = (String) requestBodyMap.get("password");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
            }
            System.out.println("dit me thua doi roi co password"+authHeader);


            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(requestBodyMap);
            }

            try {
                Pair<Object, Object> authHeaderInfo = authService.login(username, password,
                        authHeader);

            System.out.println("dit me thua doi roi co password, Pair"+authHeaderInfo);

                if (authHeaderInfo.getRight() != null) {
                    System.out.println("dit me thua doi roi co password, Pair Right not null");

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);

                }
                System.out.println("dit me thua doi roi co password, Pair Right not null");

                requestBodyMap.put("authData", authHeaderInfo.getLeft());
                System.out.println(requestBodyMap);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(requestBodyMap);
            }
        }

        Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

                System.out.println("processedBody: " + processedBody);
        if (processedBody.getRight() != null) {
            System.out.println(processedBody.getRight());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(requestBodyMap);
        } else {
            System.out.println(processedBody.getLeft());

            requestBodyMap.put("authData", processedBody.getLeft());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
        }

    } catch (Exception e) {
        logger.error("Error processing request: {}", requestBodyMap);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(requestBodyMap);
    } finally {
        logger.info("default body", requestBodyMap);
    }
}


@PatchMapping("/permissioncheck")
public ResponseEntity<Map<String, Object>> checkPermissionPatch(
        @RequestHeader(value = "X-Original-URI", required = false) String originalUri,
        @RequestHeader(value = "X-Original-Method", required = false) String originalMethod,
        @RequestHeader(value = "Authorization", required = false) String authHeader,
        @RequestHeader(value = "Cookie", required = false) String cookieHeader,
        @RequestBody Object requestBody) {
    ObjectMapper objectMapper = new ObjectMapper();
System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);

    
    // In type của requestBody để debug
    System.out.println("Type of requestBody: " + (requestBody != null ? requestBody.getClass().getName() : "null"));

    // Logic chuyển từ Object sang Map<String, Object>
    Map<String, Object> requestBodyMap;
    try {
        if (requestBody == null) {
            // Trường hợp requestBody là null
            requestBodyMap = new HashMap<>();
            System.out.println("requestBody is null, returning empty map");
        } else if (requestBody instanceof String) {
            // Trường hợp requestBody là String (raw JSON)
            requestBodyMap = objectMapper.readValue((String) requestBody, new TypeReference<Map<String, Object>>() {
            });
            System.out.println("Parsed String to Map: " + requestBodyMap);
        } else if (requestBody instanceof Map) {
            // Trường hợp requestBody đã là Map (đã được deserialize)
            requestBodyMap = (Map<String, Object>) requestBody;
            System.out.println("Directly casted to Map: " + requestBodyMap);
        } else {
            // Trường hợp khác (không mong đợi), trả về map rỗng hoặc xử lý theo ý mày
            requestBodyMap = new HashMap<>();
            System.out.println("Unexpected type, returning empty map: " + requestBody.getClass().getName());
        }
    } catch (JsonProcessingException e) {
        // Xử lý lỗi khi parse JSON từ String
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "Cannot parse requestBody to Map: " + e.getMessage());
        System.out.println("Error parsing JSON: " + e.getMessage());
        return ResponseEntity.badRequest().body(errorResponse);
    }

    // Logic xử lý với requestBodyMap (bây giờ là Map<String, Object>)
    System.out.println("Username: " + requestBodyMap.get("username"));
    System.out.println("Password: " + requestBodyMap.get("password"));

    // Tạo response
    // System.out.println(map.get("username"));
    System.out.println("Anh yeu em ");
    System.out.println(cookieHeader);
    System.out.println("Anh nho em");
    System.out.println(requestBody);
    System.out.println(originalUri);
    System.out.println(originalMethod);
    System.out.println(authHeader);
    // return null;
    try {
        logger.info("ditmethuadoiroi", requestBodyMap);
        if (requestBodyMap == null) {
            requestBodyMap = new HashMap<>();
        }
        System.out.println(requestBodyMap);
        String str2 = "/login";
        // if (requestBodyMap.containsKey("password")) {
        if (originalUri.toUpperCase().contains(str2.toUpperCase())) {

            String username = (String) requestBodyMap.get("username");
            String password = (String) requestBodyMap.get("password");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
            }
            System.out.println("dit me thua doi roi co password"+authHeader);


            if (username == null || password == null) {
                return ResponseEntity.badRequest()
                        .body(requestBodyMap);
            }

            try {
                Pair<Object, Object> authHeaderInfo = authService.login(username, password,
                        authHeader);

            System.out.println("dit me thua doi roi co password, Pair"+authHeaderInfo);

                if (authHeaderInfo.getRight() != null) {
                    System.out.println("dit me thua doi roi co password, Pair Right not null");

                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBodyMap);

                }
                System.out.println("dit me thua doi roi co password, Pair Right not null");

                requestBodyMap.put("authData", authHeaderInfo.getLeft());
                System.out.println(requestBodyMap);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(requestBodyMap);
            }
        }

        Pair<Map<String, Object>, Object> processedBody = perminssionClientService.checkPermission(
                originalUri, originalMethod, authHeader, cookieHeader, requestBodyMap);

                System.out.println("processedBody: " + processedBody);
        if (processedBody.getRight() != null) {
            System.out.println(processedBody.getRight());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(requestBodyMap);
        } else {
            System.out.println(processedBody.getLeft());

            requestBodyMap.put("authData", processedBody.getLeft());
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBodyMap);
        }

    } catch (Exception e) {
        logger.error("Error processing request: {}", requestBodyMap);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(requestBodyMap);
    } finally {
        logger.info("default body", requestBodyMap);
    }
}

}
