//package com.dovhal.application.config;
//
//import com.dovhal.application.model.Product;
//import org.springframework.context.ApplicationContext;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.web.PagedResourcesAssembler;
//import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
//import org.springframework.web.method.support.HandlerMethodArgumentResolver;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
//
//import java.util.List;
//
//@Configuration
//public class HateoasConfig implements WebMvcConfigurer {
//
//    public HateoasConfig(ApplicationContext applicationContext) {
//    }
//
//    @Override
//    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
//        // Регистрируем HateoasPageableHandlerMethodArgumentResolver
//        resolvers.add(new HateoasPageableHandlerMethodArgumentResolver());
//    }
//
//}
//
