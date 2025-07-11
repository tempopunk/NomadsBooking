package com.nomads;



import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nomads.entity.Packages;
import com.nomads.repository.PackageRepository;
import com.nomads.service.AuthFeignProxy;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
	
	private final PackageRepository packageRepository;
	
	private final AuthFeignProxy authFeignProxy;
	


    
    

    @Override
    @Transactional // Ensures all operations are atomic
    public void run(String... args) throws Exception {
    	
    	if(packageRepository.count()==0) {
    		Packages p1 = new Packages("chennai","vizag",1,2,1,2,4,LocalDate.now(),6000.30,Arrays.asList(                
                    "Day 1 (2025-08-12): Flight to Singapore, hotel check-in",
                    "Day 2 (2025-08-13): Visit Sentosa Island",
                    "Day 3 (2025-08-14): Marina Bay city tour and shopping",
                    "Day 4 (2025-08-15): Return flight"
                ));
            Packages p2 = new Packages("chennai","vizag",1,3,1,2,2,LocalDate.now(),3500.30,Arrays.asList(                
                    "Day 1 (2025-08-12): Flight to Singapore, hotel check-in",
                   
                    "Day 2 (2025-08-15): Return flight"
                ));
            
            List<Packages> pacs = packageRepository.saveAll(Arrays.asList(p1,p2));
            authFeignProxy.linkId("Package", 3,pacs.get(0).getPackageId());
            authFeignProxy.linkId("Package", 3,pacs.get(1).getPackageId());
            
    		
    	}
        
    }
}