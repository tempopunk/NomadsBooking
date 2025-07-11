package com.nomads.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name="users")
@NoArgsConstructor
@Getter
@Setter
public class User extends AuditableBaseEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int userId;
	
	private String name;
	@Column(unique = true)
	private String email;
	@Column(name="password_hash")
	private String passwordHash;
	
	@ManyToOne
	@JoinColumn(name ="role_id")
	private Roles role;
	private boolean isDeleted;
	
	public User(String name, String email, String passwordHash, Roles role, boolean isDeleted) {
		super();
		this.name = name;
		this.email = email;
		this.passwordHash = passwordHash;
		this.role = role;
		this.isDeleted = isDeleted;
	}
	
	
	

}
