package com.Controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Servlet implementation class ControllerServlet
 */
@WebServlet("/ControllerServlet")
public class ControllerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ControllerServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONArray jarr=new JSONArray();
		JSONObject jon=new JSONObject();
		
		jon.put("1", "prakash");
		jon.put("2", "palani");
		jon.put("3", "johnson");
		jon.put("4", "saran");
		jon.put("5", "satz");
		jon.put("6", "lokesh");
		
		response.getWriter().write(jon.toString());
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		
		JSONArray jarr=new JSONArray();
		JSONObject jon=new JSONObject();
		
		jon.put("1", "one");
		jon.put("2", "two");
		jon.put("3", "three");
		jon.put("4", "four");
		jon.put("5", "five");
		jon.put("6", "six");
		
		response.getWriter().write(jon.toString());
		
	}
}
