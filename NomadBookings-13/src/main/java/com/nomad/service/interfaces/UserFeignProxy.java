package com.nomad.service.interfaces;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="UserAuthentication")
public interface UserFeignProxy {
	@GetMapping("api/v1/auth/micro/gethagentid/{hoteId}")
    public int gethotelagent(@PathVariable int hoteId) ;
	@GetMapping("api/v1/auth/micro/getfagentid/{flightId}")
    public int getflightagent(@PathVariable int flightId) ;
	 @GetMapping("api/v1/auth/micro/getpagentid/{packageId}")
	public int getpackageagent(@PathVariable int packageId);
    
}
