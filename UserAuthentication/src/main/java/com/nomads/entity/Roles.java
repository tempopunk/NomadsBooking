package com.nomads.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
public class Roles {
	@Id
	private int roleId;
	@Column(name = "role_name")
	private String roleName;
}
