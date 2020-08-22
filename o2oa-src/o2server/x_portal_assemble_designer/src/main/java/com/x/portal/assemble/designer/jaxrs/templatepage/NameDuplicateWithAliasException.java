package com.x.portal.assemble.designer.jaxrs.templatepage;

import com.x.base.core.project.exception.PromptException;

class NameDuplicateWithAliasException extends PromptException {

	private static final long serialVersionUID = -9089355008820123519L;

	NameDuplicateWithAliasException(String name) {
		super("名称与别名重复: {} .", name);
	}
}
