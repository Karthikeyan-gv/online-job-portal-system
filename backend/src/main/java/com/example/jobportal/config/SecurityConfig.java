package com.example.jobportal.config;

import com.example.jobportal.security.JwtAuthenticationEntryPoint;
import com.example.jobportal.security.JwtAuthenticationFilter;
import com.example.jobportal.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Bean
    public JwtAuthenticationFilter authenticationJwtTokenFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.List.of("*"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> 
                    auth.requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher(org.springframework.http.HttpMethod.OPTIONS, "/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/auth/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/jobs/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/companies/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/categories/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/skills/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/contact/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/uploads/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/h2-console/**")).permitAll()
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/admin/**")).hasAuthority("ROLE_ADMIN")
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/employer/**")).hasAnyAuthority("ROLE_EMPLOYER", "ROLE_ADMIN")
                        .requestMatchers(org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher("/api/jobseeker/**")).hasAnyAuthority("ROLE_JOB_SEEKER", "ROLE_ADMIN")
                        .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
