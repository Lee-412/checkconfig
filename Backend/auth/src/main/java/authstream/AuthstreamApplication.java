package authstream;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AuthstreamApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthstreamApplication.class, args);
    }     
}
