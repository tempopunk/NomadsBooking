//package com.nomads.controller;
//
//
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.nomads.dto.AgentDto;
//import com.nomads.dto.LoginRequest;
//import com.nomads.dto.LoginResponse;
//import com.nomads.dto.UserDto;
//import com.nomads.service.AuthService;
//
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/v1")
//@RequiredArgsConstructor
//public class AuthController {
//	
//    private final AuthService authService;
//	
//	
//
//    // 🔹 Handles registration for Users & Admins
//    @PostMapping("/register/user")
//    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDto userDto) {
//        return ResponseEntity.ok(authService.registerUser(userDto));
//    }
// 
//    // 🔹 Handles registration for Travel, Hotel & Flight Agents
//    @PostMapping("/register/agent")
//    public ResponseEntity<String> registerAgent(@Valid @RequestBody AgentDto agentDto) throws Exception {
//        return ResponseEntity.ok(authService.registerAgent(agentDto));
//    }
//    
//    @GetMapping("/test")
//    public String test() {
//    	return "hello";
//    }
//    
//    @PostMapping("/login/agent")
//    public ResponseEntity<LoginResponse> loginAgent(@Valid @RequestBody LoginRequest loginRequest) {
//    	
//    	
//    	return ResponseEntity.ok(authService.loginAgent(loginRequest.getEmail(), loginRequest.getPassword()));
//    	
//    }
//    
//    @PostMapping("/login/user")
//    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
//    	
//    	
//    	return ResponseEntity.ok(authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword()));
//    }
//    
//    @GetMapping("/hotel_agent/test")
//    public String test1(){
//    	return "hello this should be accesed by hotel manager only";
//    }
//    
//    @GetMapping("/user/test")
//    public String test2(){
//    	return "hello this should be accesed by user";
//    }
//    
//
//}
package com.nomads.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nomads.dto.AgentDto;
import com.nomads.dto.AgentProfileDto;
import com.nomads.dto.LoginRequest;
import com.nomads.dto.LoginResponse;
import com.nomads.dto.UserDto;
import com.nomads.service.AuthService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
//@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    
    @PostMapping("/register/user")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserDto userDto) {
        return ResponseEntity.ok(authService.registerUser(userDto));
    }

    
    @PostMapping("/register/agent")
    public ResponseEntity<String> registerAgent(@Valid @RequestBody AgentDto agentDto) throws Exception {
        return ResponseEntity.ok(authService.registerAgent(agentDto));
    }

    
    @GetMapping("/test")
    public String test() {
        return "hello";
    }

    
    @PostMapping("/login/agent")
    public ResponseEntity<LoginResponse> loginAgent(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.loginAgent(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    
    @PostMapping("/login/user")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword()));
    }

    
    @GetMapping("/hotel_agent/test")
    public String test1() {
        return "hello this should be accessed by hotel manager only";
    }

    
    @GetMapping("/user/test")
    public String test2() {
        return "hello this should be accessed by user";
    }
    @GetMapping("micro/gethagentid/{hoteId}")
    public int gethotelagent(@PathVariable int hoteId) {
    	
    	return authService.gethotelagent(hoteId);
    }
    @GetMapping("micro/getfagentid/{flightId}")
    public int getflightagent(@PathVariable int flightId) {
    	return authService.getflightagent(flightId);
    }
    @GetMapping("micro/getpagentid/{packageId}")
    public int getpackageagent(@PathVariable int packageId) {
    	return authService.gettravelagent(packageId);
    }
    
    @PostMapping("micro/linkid/{agentType}/{agentId}/{id}")
    public ResponseEntity<String> linkId(@PathVariable String agentType,@PathVariable int agentId, @PathVariable int id){
    	return ResponseEntity.ok(authService.linkId(agentType,agentId,id));
    }
    
    @GetMapping("/hotel_agent/getHotelId/{agentId}")
    public ResponseEntity<Integer> getHotelId(@PathVariable int agentId){
    	return ResponseEntity.ok(authService.getHotelId(agentId));
    }
    
    @GetMapping("/package_agent/getPackageIds/{agentId}")
    public ResponseEntity<List<Integer>> getPackageIds(@PathVariable int agentId){
    	return ResponseEntity.ok(authService.getPackageIds(agentId));
    }
    
    @GetMapping("/flight_agent/getFlightIds/{agentId}")
    public ResponseEntity<List<Integer>> getFlightIds(@PathVariable int agentId){
    	return ResponseEntity.ok(authService.getFlightIds(agentId));
    }
    
    @PutMapping("/user/profile/{userId}")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable int userId,
            @RequestParam @NotBlank(message = "Name cannot be blank")
            @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters") String name, // NEW: @RequestParam for name
            @RequestParam @NotBlank(message = "Email cannot be blank")
            @Email(message = "Email should be a valid email format")
            @Size(min = 5, max = 100, message = "Email must be between 5 and 100 characters") String email) { // NEW: @RequestParam for email
        
        return ResponseEntity.ok(authService.updateUserProfile(userId, name, email));
    }
    
    @PutMapping("/agent/profile")
    public ResponseEntity<String> updateAgentProfile(@RequestBody AgentProfileDto agentProfileDto){
           
        
        return ResponseEntity.ok(authService.updateAgentProfile(agentProfileDto));
    }
    
    @GetMapping("/agent/profile/{agentId}")
    public ResponseEntity<AgentProfileDto> getAgentProfile(@PathVariable int agentId){
           
        
        return ResponseEntity.ok(authService.getAgentProfile(agentId));
    }
}

