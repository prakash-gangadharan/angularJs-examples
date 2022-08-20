package com.DatabaseManager;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

	public static Connection getConection() {
		Connection conn = null;

		try {
			Class.forName("org.postgresql.Driver");
			System.out.println("postgresql JDBC Driver Registered!");
			conn = DriverManager.getConnection(
					"jdbc:postgresql://127.0.0.1:5432/ss_velocity", "postgres",
					"smith");
			System.out.println("Opened database successfully");

		} catch (ClassNotFoundException e) {
			System.out.println("This is something you have not add in postgresql library to classpath!");
			e.printStackTrace();
		} catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage());
		}

		return conn;
	}


	public static void main(String args[]){
		System.out.println(DatabaseConnection.getConection());
	}
}


