package com.x.processplatform.core.entity.content;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.x.base.core.entity.JsonProperties;
import com.x.base.core.project.annotation.FieldDescribe;

public class WorkProperties extends JsonProperties {

	private static final long serialVersionUID = -62236689373222398L;

	@FieldDescribe("强制待办处理人")
	private List<String> manualForceTaskIdentityList = new ArrayList<>();

	@FieldDescribe("授权对象")
	private Map<String, String> manualEmpowerMap = new LinkedHashMap<>();

	@FieldDescribe("服务回调值")
	private Map<String, Object> serviceValue = new LinkedHashMap<>();

	@FieldDescribe("标题")
	private String title;

	@FieldDescribe("拆分值列表")
	private List<String> splitValueList = new ArrayList<>();

	public List<String> getManualForceTaskIdentityList() {
		if (this.manualForceTaskIdentityList == null) {
			this.manualForceTaskIdentityList = new ArrayList<>();
		}
		return this.manualForceTaskIdentityList;
	}

	public void setManualForceTaskIdentityList(List<String> manualForceTaskIdentityList) {
		this.manualForceTaskIdentityList = manualForceTaskIdentityList;
	}

	public Map<String, String> getManualEmpowerMap() {
		if (this.manualEmpowerMap == null) {
			this.manualEmpowerMap = new LinkedHashMap<>();
		}
		return this.manualEmpowerMap;
	}

	public void setManualEmpowerMap(Map<String, String> manualEmpowerMap) {
		this.manualEmpowerMap = manualEmpowerMap;
	}

	public Map<String, Object> getServiceValue() {
		if (this.serviceValue == null) {
			this.serviceValue = new LinkedHashMap<>();
		}
		return this.serviceValue;
	}

	public void setServiceValue(Map<String, Object> serviceValue) {
		this.serviceValue = serviceValue;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<String> getSplitValueList() {
		if (null == this.splitValueList) {
			this.splitValueList = new ArrayList<>();
		}
		return this.splitValueList;
	}

	public void setSplitValueList(List<String> splitValueList) {
		this.splitValueList = splitValueList;
	}

}
