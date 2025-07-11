package com.nomads.service;





import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nomads.dto.AgentDto;
import com.nomads.dto.AgentProfileDto;
import com.nomads.dto.LoginResponse;
import com.nomads.dto.UserDto;
import com.nomads.entity.Agents;
import com.nomads.entity.FlightAgent;
import com.nomads.entity.HotelAgent;
import com.nomads.entity.Roles;
import com.nomads.entity.TravelAgent;
import com.nomads.entity.User;
import com.nomads.exception.AgentAlreadyExistsException;
import com.nomads.exception.InvalidAgentCredentialsException;
import com.nomads.exception.InvalidUserCredentialsException;
import com.nomads.exception.ResourceNotFoundException;
import com.nomads.exception.UserAlreadyExistsException;
import com.nomads.repository.AgentRepository;
import com.nomads.repository.FlightAgentRepository;
import com.nomads.repository.HotelAgentRepository;
import com.nomads.repository.RolesRepository;
import com.nomads.repository.TravelAgentRepository;
import com.nomads.repository.UserRepository;
import com.nomads.security.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthService {
	
    private final UserRepository userRepository;
    
    private final AgentRepository agentRepository;
    
    private final HotelAgentRepository hotelAgentRepository;
    
    private final FlightAgentRepository flightAgentRepository;
    
    private final TravelAgentRepository travelAgentRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    private final RolesRepository rolesRepository;
    
    
    
    
    private final JwtUtil jwtUtil;
 
    // 🔹 Register Users & Admins
    public String registerUser(UserDto userDto) {
    	Roles role = null;
        Optional<Roles> roles = rolesRepository.findById(2);
		if(roles.isPresent()) {
			role = roles.get();
		}
		User user1 = userRepository.findByEmail(userDto.getEmail());
		if(user1 != null) {
			log.info("user is already registered");
			throw new UserAlreadyExistsException("You have already registered");
		}
		else {
			User user = new User(userDto.getName(),userDto.getEmail(),passwordEncoder.encode(userDto.getPasswordHash()),role,false);
			userRepository.save(user);
			log.info("user registered Successfully");
	        return "User Registered Successfully";
		}
		
    }
 
    // 🔹 Register Travel, Hotel & Flight Agents
    public String registerAgent(AgentDto agentDto) throws Exception {
    	Roles role = null;
    	
    	Agents agent1 = agentRepository.findByEmail(agentDto.getEmail());
    	if(agent1 != null) {
    		 log.info("agent is already registered");
    		 throw new AgentAlreadyExistsException("You have already registered");
    	}
    	
    	if(agentDto.getAgentType().equals("HotelAgent")) {
    		Optional<Roles> roles = rolesRepository.findById(3);
    		if(roles.isPresent()) {
    			role = roles.get();
    		}
    		Agents agent = new Agents(agentDto.getName(),agentDto.getEmail(),passwordEncoder.encode(agentDto.getPasswordHash()),agentDto.getAgentType(),role,agentDto.getCompanyName(),agentDto.getAddress(),agentDto.getPhoneNumber());
    		agentRepository.save(agent);
    		HotelAgent hotelAgent = new HotelAgent(agent,0);
    		hotelAgentRepository.save(hotelAgent);

    		log.info("hotel agent successfully registered");
    	}
    	else if(agentDto.getAgentType().equals("FlightAgent")) {
    		Optional<Roles> roles = rolesRepository.findById(4);
    		if(roles.isPresent()) {
    			role = roles.get();
    		}
    		Agents agent = new Agents(agentDto.getName(),agentDto.getEmail(),passwordEncoder.encode(agentDto.getPasswordHash()),agentDto.getAgentType(),role,agentDto.getCompanyName(),agentDto.getAddress(),agentDto.getPhoneNumber());
    		agentRepository.save(agent);

    		
    		log.info("flight agent successfully registered");
    	}
    	else if(agentDto.getAgentType().equals("TravelAgent")) {
    		Optional<Roles> roles = rolesRepository.findById(5);
    		if(roles.isPresent()) {
    			role = roles.get();
    		}
    		Agents agent = new Agents(agentDto.getName(),agentDto.getEmail(),passwordEncoder.encode(agentDto.getPasswordHash()),agentDto.getAgentType(),role,agentDto.getCompanyName(),agentDto.getAddress(),agentDto.getPhoneNumber());
    		agentRepository.save(agent);

    		log.info("travel agent successfully registered");
    	}
    	log.info("agent not registered succesfully");
        return "Agent Registered unSuccessfully";
    }
    
 // 🔹 Login Users & Admins
    public LoginResponse loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().getRoleName());
            log.info("User login succesfully and token is generated succesfully");
            return  new LoginResponse(user.getUserId(),user.getName(),email,token,user.getRole().getRoleName());
        }
        log.info("user was not able to login due to invalid credentials");
        throw new InvalidUserCredentialsException("Invalid User Credentials! Please check your username and password ");
    }

    // 🔹 Login Travel Agents, Hotel Agents & Flight Agents
    public LoginResponse loginAgent(String email, String password) {
    	
        Agents agent = agentRepository.findByEmail(email);
        

        
        if (agent != null && passwordEncoder.matches(password, agent.getPasswordHash())) {
            String token = jwtUtil.generateToken(agent.getEmail(),agent.getRole().getRoleName());
            log.info("Agent login successfull and token generated succesfully");
            return  new LoginResponse(agent.getAgentId(),agent.getName(),email,token,agent.getRole().getRoleName());
        }
//        
        else {
        	log.info("agent was not able to login due to invalid credentials" );
        	throw new InvalidAgentCredentialsException("Invalid Agent Credentials! Please check your username and password ");
        }
        
    }
    
    public String linkId(String agentType,int agentId,int id) {
    	if(agentType.equals("Hotel")) {
    		Agents agent = agentRepository.findById(agentId).orElseThrow(() -> new com.nomads.exception.ResourceNotFoundException("no such agent with the given agentId"));
    		HotelAgent hotelAgent = hotelAgentRepository.findByAgentId(agentId);
    		hotelAgent.setHotelId(id);
    		hotelAgentRepository.save(hotelAgent);
    		return "Updation Successfull";
    	}
    	else if(agentType.equals("Flight")) {
    		FlightAgent flightAgent = new FlightAgent(agentId,id);
    		flightAgentRepository.save(flightAgent);
    		return "Updation Successfull";
    		
    	}
    	else {
    		TravelAgent travelAgent = new TravelAgent(agentId,id);
    		travelAgentRepository.save(travelAgent);
    		return "Updation Successfull";
    	}
    }
    
	public int gethotelagent( int hotelId) {
		HotelAgent hotelAgent = hotelAgentRepository.findByHotelId(hotelId);
		
		return hotelAgent.getAgentId();
	}
	
	public int getflightagent(int flightId) {
		Optional<FlightAgent> flightAgent = flightAgentRepository.findFirstByFlightId(flightId);
		if(flightAgent.isPresent()) {
			return flightAgent.get().getAgentId();
		}
		return 0;
	}
	
	public int gettravelagent(int travelId) {
		Optional<TravelAgent> travelAgent = travelAgentRepository.findFirstByPackageId(travelId);
		if(travelAgent.isPresent()) {
			return travelAgent.get().getAgentId();
		}
		return 0;
		
	}
	
	public int  getHotelId(int agentId){
		HotelAgent result =hotelAgentRepository.findByAgentId(agentId);
		int id=0;
		if(result!=null) {
			id = result.getHotelId();
		}
		
		
		
		return id;
	}
	
	public List<Integer>  getPackageIds(int agentId){
		List<TravelAgent> result =travelAgentRepository.findByAgentId(agentId);
		ArrayList<Integer> ids = new ArrayList<>();
		for(TravelAgent travelAgent : result) {
			ids.add(travelAgent.getPackageId());
		}
		return ids;
	}
	
	public List<Integer>  getFlightIds(int agentId){
		List<FlightAgent> result = flightAgentRepository.findByAgentId(agentId);
		ArrayList<Integer> ids = new ArrayList<>();
		for(FlightAgent flightAgent : result) {
			ids.add(flightAgent.getFlightId());
		}
		return ids;
	}
	
	@Transactional
    public String updateUserProfile(int userId, String newName, String newEmail) { // MODIFIED PARAMETERS
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

       
        existingUser.setName(newName);
        existingUser.setEmail(newEmail);
        userRepository.save(existingUser);
        log.info("User profile updated successfully for user ID: {}", userId);
        return "User profile updated successfully";
    }
	
	@Transactional
    public String updateAgentProfile(AgentProfileDto agentProfileDto) { // MODIFIED PARAMETERS
        Agents existingAgent = agentRepository.findById(agentProfileDto.getAgentId())
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentProfileDto.getAgentId()));

       
        existingAgent.setName(agentProfileDto.getName());
        existingAgent.setEmail(agentProfileDto.getEmail());
        existingAgent.setAddress(agentProfileDto.getAddress());
        existingAgent.setPhoneNumber(agentProfileDto.getPhoneNumber());
        existingAgent.setCompanyName(agentProfileDto.getCompanyName());
        existingAgent = agentRepository.save(existingAgent);
        log.info("Agent profile updated successfully for user ID: {}",agentProfileDto.getAgentId() );
        return "AgentProfile Updated Successfully";
    }
	
	public AgentProfileDto getAgentProfile(int agentId) {
		Agents existingAgent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));
		AgentProfileDto agentProfileDto = new AgentProfileDto();
		agentProfileDto.setEmail(existingAgent.getEmail());
		agentProfileDto.setName(existingAgent.getName());
		agentProfileDto.setCompanyName(existingAgent.getCompanyName());
		agentProfileDto.setPhoneNumber(existingAgent.getPhoneNumber());
		agentProfileDto.setAddress(existingAgent.getAddress());
		
		return agentProfileDto;
		
	}

}
