package com.chaopraya.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import org.hibernate.annotations.GenericGenerator;

@Entity
public class PaymentMethod {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    private String id;
    private String name;
    private String userId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getuserId(){
        return userId;
    }

    public void setUser_id(String userId){
        this.userId=userId;
    }


}
