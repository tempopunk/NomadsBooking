package com.nomads.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name="UserAuthentication")
public interface AuthFeignProxy {
	
	@PostMapping("api/v1/auth/micro/linkid/{agentType}/{agentId}/{id}")
    public ResponseEntity<String> linkId(@PathVariable String agentType,@PathVariable int agentId,@PathVariable int id);

}