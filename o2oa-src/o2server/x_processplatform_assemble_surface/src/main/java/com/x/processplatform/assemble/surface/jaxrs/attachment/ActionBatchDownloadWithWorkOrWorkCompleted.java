package com.x.processplatform.assemble.surface.jaxrs.attachment;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;

import com.x.base.core.container.EntityManagerContainer;
import com.x.base.core.container.factory.EntityManagerContainerFactory;
import com.x.base.core.project.cache.Cache.CacheCategory;
import com.x.base.core.project.cache.Cache.CacheKey;
import com.x.base.core.project.cache.CacheManager;
import com.x.base.core.project.exception.ExceptionAccessDenied;
import com.x.base.core.project.http.ActionResult;
import com.x.base.core.project.http.EffectivePerson;
import com.x.base.core.project.jaxrs.WoFile;
import com.x.base.core.project.logger.Logger;
import com.x.base.core.project.logger.LoggerFactory;
import com.x.base.core.project.tools.DateTools;
import com.x.processplatform.assemble.surface.Business;
import com.x.processplatform.core.entity.content.Attachment;
import com.x.processplatform.core.entity.content.Work;
import com.x.processplatform.core.entity.content.WorkCompleted;

class ActionBatchDownloadWithWorkOrWorkCompleted extends BaseAction {

	private static Logger logger = LoggerFactory.getLogger(ActionBatchDownloadWithWorkOrWorkCompleted.class);

	ActionResult<Wo> execute(EffectivePerson effectivePerson, String workId, String site, String fileName, String flag)
			throws Exception {
		try (EntityManagerContainer emc = EntityManagerContainerFactory.instance().create()) {
			ActionResult<Wo> result = new ActionResult<>();
			Business business = new Business(emc);
			String title = "";
			String job = "";
			Work work = emc.find(workId, Work.class);
			if (work == null) {
				WorkCompleted workCompleted = emc.find(workId, WorkCompleted.class);
				if (null == workCompleted) {
					throw new Exception("workId: " + workId + " not exist in work or workCompleted");
				}
				if (!business.readable(effectivePerson, workCompleted)) {
					throw new ExceptionWorkCompletedAccessDenied(effectivePerson.getDistinguishedName(),
							workCompleted.getTitle(), workCompleted.getId());
				}
				title = workCompleted.getTitle();
				job = workCompleted.getJob();
			} else {
				if (!business.readable(effectivePerson, work)) {
					throw new ExceptionAccessDenied(effectivePerson, work);
				}
				title = work.getTitle();
				job = work.getJob();
			}
			List<Attachment> attachmentList;
			if (StringUtils.isBlank(site) || EMPTY_SYMBOL.equals(site)) {
				attachmentList = business.attachment().listWithJobObject(job);
			} else if (site.indexOf("~") == -1) {
				attachmentList = emc.listEqualAndEqual(Attachment.class, Attachment.job_FIELDNAME, job,
						Attachment.site_FIELDNAME, site);
			} else {
				attachmentList = emc.listEqualAndIn(Attachment.class, Attachment.job_FIELDNAME, job,
						Attachment.site_FIELDNAME, Arrays.asList(site.split("~")));
			}

			List<String> identities = business.organization().identity().listWithPerson(effectivePerson);
			List<String> units = business.organization().unit().listWithPerson(effectivePerson);
			List<Attachment> readableAttachmentList = new ArrayList<>();
			for (Attachment attachment : attachmentList) {
				if (this.read(attachment, effectivePerson, identities, units)) {
					readableAttachmentList.add(attachment);
				}
			}
			if (StringUtils.isBlank(fileName)) {
				fileName = title + DateTools.format(new Date(), DateTools.formatCompact_yyyyMMddHHmmss) + ".zip";
			} else {
				String extension = FilenameUtils.getExtension(fileName);
				if (StringUtils.isEmpty(extension)) {
					fileName = fileName + ".zip";
				}
			}

			Map<String, byte[]> map = new HashMap<>();
			if (StringUtils.isNotEmpty(flag)) {
				CacheCategory cacheCategory = new CacheCategory(CacheResultObject.class);
				CacheKey cacheKey = new CacheKey(flag);
				Optional<?> optional = CacheManager.get(cacheCategory, cacheKey);
				if (optional.isPresent()) {
					CacheResultObject ro = (CacheResultObject) optional.get();
					map.put(ro.getName(), ro.getBytes());
				}
			}

			logger.info("batchDown to {}，att size {}, from work {}", fileName, attachmentList.size(), workId);
			try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
				business.downToZip(readableAttachmentList, os, map);
				byte[] bs = os.toByteArray();
				Wo wo = new Wo(bs, this.contentType(false, fileName), this.contentDisposition(false, fileName));
				result.setData(wo);
			}

			return result;
		}
	}

	public static class Wo extends WoFile {

		public Wo(byte[] bytes, String contentType, String contentDisposition) {
			super(bytes, contentType, contentDisposition);
		}

	}

}
