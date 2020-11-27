package com.x.processplatform.assemble.surface.jaxrs.control;

import java.util.concurrent.CompletableFuture;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.exception.ExceptionEntityNotExist;
import com.x.base.core.project.gson.GsonPropertyObject;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.StandardJaxrsAction;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.processplatform.assemble.surface.Business;

abstract class BaseAction extends StandardJaxrsAction {

	private static Logger logger = LoggerFactory.getLogger(BaseAction.class);

	protected static class AbstractControl extends GsonPropertyObject {
		/* 是否可以看到 */
		private Boolean allowVisit = false;
		/* 是否可以直接流转 */
		private Boolean allowProcessing = false;
		/* 是否可以处理待阅 */
		private Boolean allowReadProcessing = false;
		/* 是否可以保存数据 */
		private Boolean allowSave = false;
		/* 是否可以重置处理人 */
		private Boolean allowReset = false;
		/* 是否可以调度 */
		private Boolean allowReroute = false;
		/* 是否可以删除 */
		private Boolean allowDelete = false;
		/* 是否可以增加会签分支 */
		private Boolean allowAddSplit = false;
		/* 是否可以召回 */
		private Boolean allowRetract = false;
		/* 是否可以回滚 */
		private Boolean allowRollback = false;
		/* 是否可以回滚 */
		private Boolean allowPress = false;

		public Boolean getAllowSave() {
			return allowSave;
		}

		public void setAllowSave(Boolean allowSave) {
			this.allowSave = allowSave;
		}

		public Boolean getAllowReset() {
			return allowReset;
		}

		public void setAllowReset(Boolean allowReset) {
			this.allowReset = allowReset;
		}

		public Boolean getAllowRetract() {
			return allowRetract;
		}

		public void setAllowRetract(Boolean allowRetract) {
			this.allowRetract = allowRetract;
		}

		public Boolean getAllowReroute() {
			return allowReroute;
		}

		public void setAllowReroute(Boolean allowReroute) {
			this.allowReroute = allowReroute;
		}

		public Boolean getAllowProcessing() {
			return allowProcessing;
		}

		public void setAllowProcessing(Boolean allowProcessing) {
			this.allowProcessing = allowProcessing;
		}

		public Boolean getAllowDelete() {
			return allowDelete;
		}

		public void setAllowDelete(Boolean allowDelete) {
			this.allowDelete = allowDelete;
		}

		public Boolean getAllowVisit() {
			return allowVisit;
		}

		public void setAllowVisit(Boolean allowVisit) {
			this.allowVisit = allowVisit;
		}

		public Boolean getAllowReadProcessing() {
			return allowReadProcessing;
		}

		public void setAllowReadProcessing(Boolean allowReadProcessing) {
			this.allowReadProcessing = allowReadProcessing;
		}

		public Boolean getAllowAddSplit() {
			return allowAddSplit;
		}

		public void setAllowAddSplit(Boolean allowAddSplit) {
			this.allowAddSplit = allowAddSplit;
		}

		public Boolean getAllowRollback() {
			return allowRollback;
		}

		public void setAllowRollback(Boolean allowRollback) {
			this.allowRollback = allowRollback;
		}

		public Boolean getAllowPress() {
			return allowPress;
		}

		public void setAllowPress(Boolean allowPress) {
			this.allowPress = allowPress;
		}

	}

	protected CompletableFuture<Boolean> checkControlFuture(EffectivePerson effectivePerson, String flag) {
		return CompletableFuture.supplyAsync(() -> {
			Boolean value = false;
			try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
				Business business = new Business(emc);
				value = business.readableWithWorkOrWorkCompleted(effectivePerson, flag,
						new ExceptionEntityNotExist(flag));
			} catch (Exception e) {
				logger.error(e);
			}
			return value;
		});
	}

}
