package com.nomads;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.nomads.entity.Agents;
import com.nomads.entity.HotelAgent;
import com.nomads.entity.Roles;
import com.nomads.entity.User;
import com.nomads.repository.AgentRepository;
import com.nomads.repository.HotelAgentRepository;
import com.nomads.repository.RolesRepository;
import com.nomads.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class SeedDataLoader implements CommandLineRunner {
	
	
	private final RolesRepository rolesRepository;
	
	private final UserRepository userRepository;
	
    private final PasswordEncoder passwordEncoder;
    
    private final AgentRepository agentRepository;
    
    private final HotelAgentRepository hotelAgentRepository;
    

    
   
    


	@SuppressWarnings("unused")
	@Override
	@Transactional
	public void run(String... args) throws Exception {
	
		if(rolesRepository.count()==0) {
			rolesRepository.save(new Roles(1,"Admin"));
			rolesRepository.save(new Roles(2,"User"));
			rolesRepository.save(new Roles(3,"HotelAgent"));
			rolesRepository.save(new Roles(4,"FlightAgent"));
			rolesRepository.save(new Roles(5,"TravelAgent"));
		}
		
		
		if(userRepository.count()==0) {
			Optional<Roles> roles  = rolesRepository.findById(1);
			Roles role = null;
			if(roles.isPresent()) {
				role = roles.get();
			}
			Optional<Roles> roles1  = rolesRepository.findById(2);
			Roles role1 = null;
			if(roles1.isPresent()) {
				role1 = roles1.get();
			}
			Optional<Roles> roles2  = rolesRepository.findById(3);
			Roles role2 = null;
			if(roles2.isPresent()) {
				role2 = roles2.get();
			}
			Optional<Roles> roles3  = rolesRepository.findById(4);
			Roles role3 = null;
			if(roles3.isPresent()) {
				role3 = roles3.get();
			}
			Optional<Roles> roles4  = rolesRepository.findById(5);
			Roles role4 = null;
			if(roles4.isPresent()) {
				role4 = roles4.get();
			}
		
		userRepository.save(new User("admin","admin@gmail.com",passwordEncoder.encode("admin"),role,false));
		User user1 = new User("Alice Smith", "alice."  + "@example.com", passwordEncoder.encode("password123"), role1, false);
        User user2 = new User("Bob Johnson", "bob." + "@example.com", passwordEncoder.encode("securepass"), role1, false);
        userRepository.saveAll(Arrays.asList(user1, user2));
        
        
        
        Agents agent1 = new Agents("Hotelier John", "john" + "@agent.com", passwordEncoder.encode("agentpass"), "HotelAgent", role2, "Grand Hotel Group", "123 Hotel St, City", "111-222-3333");
        Agents agent2 = new Agents("Resort Maria", "akhil" + "@agent.com", passwordEncoder.encode("agentpass2"), "FlightAgent", role3, "Luxury Stays Inc.", "456 Resort Ave, Town", "444-555-6666");
        Agents agent3 = new Agents("Resort Maria", "maria" + "@agent.com", passwordEncoder.encode("agentpass3"), "TravelAgent", role4, "Premium Stays Inc.", "456 Resort Ave, Town", "444-555-6666");
        List<Agents> agents = agentRepository.saveAll(Arrays.asList(agent1, agent2,agent3));
        HotelAgent hotelAgent = new HotelAgent(agents.get(0),0);
		hotelAgentRepository.save(hotelAgent);
        System.out.println("Agents created.");


        
        
        
        
	}

	}

}
