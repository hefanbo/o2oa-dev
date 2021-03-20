package com.x.processplatform.assemble.surface.jaxrs.task;

import com.x.base.core.project.exception.PromptException;

class ExceptionAlreadyPause extends PromptException {

	private static final long serialVersionUID = 1040883405179987063L;

	ExceptionAlreadyPause(String id) {
		super("待办已经处于挂起状态{}.", id);
	}
}
