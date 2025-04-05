package authstream.presentation.controllers;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

        System.out.println("Anh yeu em ");
        System.out.println(cookieHeader);
        System.out.println("Anh nho em");
        System.out.println(requestBody);
        System.out.println(originalUri);
        System.out.println(originalMethod);
        return null;
        // try {
        // logger.info("ditmethuadoiroi", requestBody);
        // if (requestBody == null) {
        // requestBody = new HashMap<>();
        // }

        // if (requestBody.containsKey("password")) {
        // String username = (String) requestBody.get("username");
        // String password = (String) requestBody.get("password");

        // if (authHeader != null && authHeader.startsWith("Bearer ")) {
        // authHeader = authHeader.substring(7); // Lấy UUID sau "Bearer "
        // }

        // if (username == null || password == null) {
        // return ResponseEntity.badRequest()
        // .body(requestBody);
        // }

        // try {
        // Pair<Object, Object> authHeaderInfo = authService.login(username, password,
        // authHeader);
        // if (authHeaderInfo.getRight() != null) {
        // return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(requestBody);

        // }
        // requestBody.put("authData", authHeaderInfo.getLeft());
        // return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBody);
        // } catch (Exception e) {
        // return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        // .body(requestBody);
        // }
        // }

        // Pair<Map<String, Object>, Object> processedBody =
        // perminssionClientService.checkPermission(
        // originalUri, originalMethod, authHeader, cookieHeader, requestBody);

        // if (processedBody.getRight() != null) {
        // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        // .body(requestBody);
        // } else {
        // requestBody.put("authData", processedBody.getLeft());
        // return ResponseEntity.status(HttpStatus.ACCEPTED).body(requestBody);
        // }

        // } catch (Exception e) {
        // logger.error("Error processing request: {}", requestBody);
        // return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        // .body(requestBody);
        // } finally {
        // logger.info("default body", requestBody);
        // }
    }
}
