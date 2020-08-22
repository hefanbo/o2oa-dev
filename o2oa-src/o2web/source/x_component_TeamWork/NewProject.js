MWF.xApplication.TeamWork = MWF.xApplication.TeamWork || {};
MWF.xApplication.TeamWork.NewProject = new Class({
    Extends: MWF.xApplication.TeamWork.Common.Popup,
    options:{
        "closeByClickMask" : false
    },
    open: function (e) {
        //设置css 和 lp等
        var css = this.css;
        this.cssPath = "../x_component_TeamWork/$NewProject/"+this.options.style+"/css.wcss";
        this._loadCss();
        if(css) this.css = Object.merge(  css, this.css );

        this.lp = this.app.lp.newProject;


        this.fireEvent("queryOpen");
        this.isNew = false;
        this.isEdited = false;
        this._open();
        this.fireEvent("postOpen");
    },

    _createTableContent: function () {
        //var a = new Element("div.aaa",{styles:{"width":"100px","height":"100px","background-color":"#f00"},text:"f分分分f分分f分分分f分分分"}).inject(this.formTableArea);
        // alert(JSON.stringify(this.css.projectAdd))
        // alert(JSON.stringify(this.lp))
        this.newProjectTop = new Element("div.newProjectTop",{styles:this.css.newProjectTop}).inject(this.formTableArea);
        this.newProjectTopText = new Element("div.newProjectTopText",{styles:this.css.newProjectTopText,text:this.lp.title}).inject(this.newProjectTop);
        this.newProjectTopClose = new Element("div.newProjectTopClose",{styles:this.css.newProjectTopClose}).inject(this.newProjectTop);
        this.newProjectTopClose.addEvents({
            click:function(){this.close()}.bind(this)
        });


        this.newProjectContainer = new Element("div.newProjectInContainer",{styles:this.css.newProjectContainer}).inject(this.formTableArea);
        this.newProjectIn = new Element("input.newProjectIn",{styles:this.css.newProjectIn,type:"text",placeholder:this.lp.name}).inject(this.newProjectContainer);
        this.newProjectIn.addEvents({
            keyup:function(){
                var v = this.newProjectIn.get("value");
                if(v.trim()==""){
                    this.newProjectAdd.setStyles({
                        "cursor":"",
                        "background-color":"#F0F0F0",
                        "color":"#666666"
                    });
                }else{
                    this.newProjectAdd.setStyles({
                        "cursor":"pointer",
                        "background-color":"#4A90E2",
                        "color":"#FFFFFF"
                    });
                }
            }.bind(this),
            focus:function(){
                this.newProjectContainer.setStyles({"border":"1px solid #4A90E2"});
            }.bind(this),
            blur:function(){
                this.newProjectContainer.setStyles({"border":"1px solid #A6A6A6"});
            }.bind(this)
        });

        this.newProjectDesContainer = new Element("div.newProjectDesContainer",{styles:this.css.newProjectDesContainer}).inject(this.formTableArea);
        this.newProjectDesIn = new Element("textarea.newProjectDesIn",{styles:this.css.newProjectDesIn,placeholder:this.lp.description}).inject(this.newProjectDesContainer);
        this.newProjectDesIn.addEvents({
            focus:function(){  //32px
                // var v = this.newProjectDesIn.get("value");
                // if(v.trim()==""){ return;
                //     //this.newProjectDesIn.setStyle("line-height","");
                //     var _h = 36;
                //     //alert(this.newProjectDesContainer.getHeight()+_h)
                //     this.newProjectDesContainer.setStyles({"height":(this.newProjectDesContainer.getHeight()+_h)+"px"});
                //     this.newProjectDesIn.setStyles({"height":(this.newProjectDesIn.getHeight()+_h)+"px"});
                //     this.formAreaNode.setStyles({"height":(this.formAreaNode.getHeight()+_h)+"px"});
                //     this.formNode.setStyles({"height":(this.formNode.getHeight()+_h)+"px"});
                //     this.formTableContainer.setStyles({"height":(this.formTableContainer.getHeight()+_h)+"px"});
                //     this.formTableArea.setStyles({"height":(this.formTableArea.getHeight()+_h)+"px"});
                //     this.formContentNode.setStyles({"height":(this.formContentNode.getHeight()+_h)+"px"});
                //
                //     var pre = this.formTableContainer.getPrevious();
                //     if(pre){
                //        pre.destroy();
                //     }
                // }
                this.newProjectDesContainer.setStyles({"border":"1px solid #4A90E2"});
            }.bind(this),
            blur:function(){
                // var v = this.newProjectDesIn.get("value");
                // if(v.trim()==""){ return;
                //     //this.newProjectDesIn.setStyle("line-height","32px");
                //     var _h = 36;
                //     this.newProjectDesContainer.setStyles({"height":(this.newProjectDesContainer.getHeight()-_h-2)+"px"});
                //     this.newProjectDesIn.setStyles({"height":(this.newProjectDesIn.getHeight()-_h-2)+"px"});
                //     this.formAreaNode.setStyles({"height":(this.formAreaNode.getHeight()-_h)+"px"});
                //     this.formNode.setStyles({"height":(this.formNode.getHeight()-_h)+"px"});
                //     this.formTableContainer.setStyles({"height":(this.formTableContainer.getHeight()-_h)+"px"});
                //     this.formTableArea.setStyles({"height":(this.formTableArea.getHeight()-_h)+"px"});
                //     this.formContentNode.setStyles({"height":(this.formContentNode.getHeight()-_h)+"px"});
                //
                //     var pre = this.formTableContainer.getPrevious();
                //     if(pre){
                //        pre.destroy();
                //     }
                // }
                this.newProjectDesContainer.setStyles({"border":"1px solid #A6A6A6"});
            }.bind(this)
        });

        this.newProjectGroupText = new Element("div.newProjectGroupText",{styles:this.css.newProjectGroupText,text:this.lp.group}).inject(this.formTableArea);
        this.newProjectGroupContainer = new Element("div.newProjectGroupContainer",{styles:this.css.newProjectGroupContainer}).inject(this.formTableArea);
        this.newProjectGroupValue = new Element("div.newProjectGroupValue",{styles:this.css.newProjectGroupValue,text:""}).inject(this.newProjectGroupContainer);
        this.newProjectGroupArrow = new Element("div.newProjectGroupArrow",{styles:this.css.newProjectGroupArrow}).inject(this.newProjectGroupContainer);
        this.newProjectGroupContainer.addEvents({
            click:function(){
                var node = this.newProjectGroupContainer;
                var data = {groups:this.selectGroup};
                //alert(JSON.stringify(this.selectGroup))
                MWF.xDesktop.requireApp("TeamWork", "GroupSelect", function(){
                    var gs = new MWF.xApplication.TeamWork.GroupSelect(this.container, node, this.app, data, {
                        axis : "y",
                        nodeStyles : {
                            "z-index" : "102"
                        },
                        onClose:function(d){
                            this.newProjectGroupContainer.setStyles({"border":"1px solid #A6A6A6"});
                            if(!d) return;
                            this.refreshGroup(function(){
                                var res = [];
                                d.each(function(dd){
                                    this.groupSearch(dd,function(json){
                                        if(json) res.push(json);
                                    }.bind(this));
                                }.bind(this));
                                this.selectGroup = res;
                                var resVal = [];
                                res.each(function(dd){
                                    resVal.push(dd.name);
                                }.bind(this));

                                this.newProjectGroupValue.set("text",resVal.join(","));
                            }.bind(this));
                        }.bind(this)
                    });
                    gs.load()
                }.bind(this));
                this.newProjectGroupContainer.setStyles({"border":"1px solid #4A90E2"});

            }.bind(this)
        });


        this.newProjectTemplateText = new Element("div.newProjectTemplateText",{styles:this.css.newProjectTemplateText,text:this.lp.template}).inject(this.formTableArea);
        this.newProjectTemplateContainer = new Element("div.newProjectTemplateContainer",{styles:this.css.newProjectTemplateContainer}).inject(this.formTableArea);
        this.newProjectTemplateValue = new Element("div.newProjectTemplateValue",{styles:this.css.newProjectTemplateValue,text:""}).inject(this.newProjectTemplateContainer);
        this.newProjectTemplateArrow = new Element("div.newProjectTemplateArrow",{styles:this.css.newProjectTemplateArrow}).inject(this.newProjectTemplateContainer);
        this.newProjectTemplateContainer.addEvents({
            click:function(){
                var tm = new MWF.xApplication.TeamWork.NewProject.TemplateSelect(this.container, this.newProjectTemplateContainer, this.app, {}, {
                    css:this.css, lp:this.lp, axis : "y",
                    position : { //node 固定的位置
                        x : "auto",
                        y : "middle"
                    },
                    nodeStyles : {
                        "min-width":"200px",
                        "width":"265px",
                        "padding":"2px",
                        "border-radius":"5px",
                        "box-shadow":"0px 0px 4px 0px #999999",
                        "z-index" : "201",
                        "min-height":"250px"
                    },
                    onPostLoad:function(){
                        tm.node.setStyles({"opacity":"0","top":(tm.node.getStyle("top").toInt()+4)+"px"});
                        var fx = new Fx.Tween(tm.node,{duration:400});
                        fx.start(["opacity"] ,"0", "1");
                    },
                    onClose:function(rd){
                        this.newProjectTemplateContainer.setStyles({"border":"1px solid #cccccc"});
                        if(!rd) return;
                        this.newProjectTemplateValue.set("text",rd.title);
                        this.templateId = rd.id;
                        // if(rd.act == "remove"){
                        //     this.close(rd);
                        //     if(this.data.projectObj){ //reload project
                        //         this.data.projectObj.createTaskGroup()
                        //     }
                        // }
                    }.bind(this)
                },null,this);
                tm.load();

                this.newProjectTemplateContainer.setStyles({"border":"1px solid #4A90E2"});

            }.bind(this)
        });

        this.newProjectAdd = new Element("div.newProjectAdd",{styles:this.css.newProjectAdd,text:this.lp.add}).inject(this.formTableArea);
        this.newProjectAdd.addEvents({
            click:function(){
                var v = this.newProjectIn.get("value").trim();
                var des = this.newProjectDesIn.get("value");
                if(v=="") return;
                var groups = [];
                if(this.selectGroup){
                    this.selectGroup.each(function(d){
                        groups.push(d.id);
                    });
                }

                var data = {
                    "title":v,
                    "description":des,
                    "groups":groups,
                    "templateId":this.templateId || ""
                };

                //this.actions.projectSave(data,function(json){
                this.rootActions.ProjectAction.save(data,function(json){
                    this.close(json);
                }.bind(this));

            }.bind(this)
        });

    },
    groupSearch:function(id,callback){
        var res = null;
        this.allGroupList.each(function(d){
            if(d.id == id) res = d;
        }.bind(this));

        if(callback)callback(res);
    },
    refreshGroup:function(callback){
        //this.actions.groupList(function(json){
        this.rootActions.ProjectGroupAction.listGroups(function(json){
            this.allGroupList = json.data;
            if(callback)callback();
        }.bind(this))
    }

});


MWF.xApplication.TeamWork.NewProject.TemplateSelect = new Class({
    Extends: MWF.xApplication.TeamWork.Common.ToolTips,
    options : {
        // displayDelay : 300,
        hasArrow:false,
        event:"click"
    },
    _loadCustom : function( callback ){
        this.rootActions = this.app.rootActions;
        var _self = this;
        this.css = this.options.css;
        this.lp = this.options.lp;
        //this.data
        //this.contentNode
        //debugger;

        var topTemplateTitle = new Element("div.topTemplateTitle",{ styles:this.css.topTemplateTitle, text: this.lp.templateTitle }).inject(this.contentNode);
        this.tempateContainer = new Element("div.tempateContainer",{ styles:this.css.tempateContainer }).inject(this.contentNode);

        this.rootActions.ProjectTemplateAction.listNextWithFilter("(0)",100,{},function(json){
            //alert(json.data.length)
            json.data.each(function(data){
                this.templateItem(data)
            }.bind(this))
        }.bind(this));

        if(callback)callback();
    },
    templateItem:function(data){
        var _self = this;
        var templateItemContainer = new Element("div.templateItemContainer",{styles:this.css.templateItemContainer, id:data.id}).inject(this.tempateContainer);
        var templateItemIcon = new Element("div.templateItemIcon",{styles:this.css.templateItemIcon}).inject(templateItemContainer);
        var templateItemTitle = new Element("div.templateItemTitle",{styles:this.css.templateItemTitle,text:data.title}).inject(templateItemContainer);

        templateItemContainer.addEvents({
            mouseover:function(){
                this.setStyles({"background-color":"rgb(242,245,247)"});
            },
            mouseout:function(){
                this.setStyles({"background-color":"#ffffff"});
            },
            click:function(){
                var res = {};
                res.id = data.id;
                res.title = data.title;
                this.close(res)
            }.bind(this)
        });

    }
});