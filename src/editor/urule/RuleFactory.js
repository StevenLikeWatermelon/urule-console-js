/**
 * @author GJ
 */
import {MsgBox} from 'flowdesigner';
(function($){
	$.fn.urule=function(){
		this.rules=[];
		var saveButton = '<div class="btn-group btn-group-sm navbar-btn" style="margin-top:0px;margin-bottom: 0px" role="group" aria-label="...">'+
							'<button id="saveButton" type="button" class="btn btn-default navbar-btn" ><i class="icon-save"></i> 保存</button>' + 
							'<button id="saveButtonNewVersion" type="button" class="btn btn-default navbar-btn" ><i class="icon-save"></i> 保存新版本</button>' +
						'</div>';
		var toolbarHtml=`<nav class="navbar navbar-default" style="margin: 5px">
        	<div style="margin-left:5px;margin-top:0px;margin-bottom: 0px">
	            <div>
	                ${saveButton}
	            </div>
            </div>
    	</nav>`;
		var toolbar=$(toolbarHtml);
		toolbar.css({
			diaplay:"inline-block"
		});
		this.append(toolbar);
		var self=this;
		$("#addRuleButton").click(function(){
			var rule=_addRule();
			rule.initTopJoin();
		});
		$("#addLoopRuleButton").click(function(){
			var rule=_addLoopRule();
			rule.initTopJoin();
		});

		$("#configVarButton").click(function(){
			if(!self.configVarDialog){
				self.configVarDialog=new urule.ConfigVariableDialog(self);				
			}
			self.configVarDialog.open();
		});
		
		$("#configConstantsButton").click(function(){
			if(!self.configConstantDialog){
				self.configConstantDialog=new urule.ConfigConstantDialog(self);				
			}
			self.configConstantDialog.open();
		});
		
		$("#configActionButton").click(function(){
			if(!self.configActionDialog){
				self.configActionDialog=new urule.ConfigActionDialog(self);				
			}
			self.configActionDialog.open();
		});
		
		$("#configParameterButton").click(function(){
			if(!self.configParameterDialog){
				self.configParameterDialog=new urule.ConfigParameterDialog(self);				
			}
			self.configParameterDialog.open();			
		});
		
		$("#saveButton").click(function(){
			save(false);
		});
		$("#saveButtonNewVersion").click(function(){
			save(true);
		});
		$("#saveButtonNewVersion").addClass("disabled");
		
		_loadRulesetFileData();

		var _this=this;
		this.sortable({
			delay: 200,
			update: function (event, ui) {
				var children=_this.children("div");
				children.each(function(index,div){
					let item=$(div),id=item.prop("id"),rules=_this.rules,targetRule=null;
					for(let rule of rules){
						if(rule.uuid===id){
							targetRule=rule;
							break;
						}
					}
					if(targetRule){
						const pos=rules.indexOf(targetRule);
						rules.splice(pos,1);
						rules.splice(index,0,targetRule);
					}
				});
				
			}
		});

		function save(newVersion){
			var xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
			xml+="<rule-set>";
			$.each(parameterLibraries,function(index,item){
				xml+="<import-parameter-library path=\""+item+"\"/>";
			});
			$.each(variableLibraries,function(index,item){
				xml+="<import-variable-library path=\""+item+"\"/>";
			});
			$.each(constantLibraries,function(index,item){
				xml+="<import-constant-library path=\""+item+"\"/>";
			});
			$.each(actionLibraries,function(index,item){
				xml+="<import-action-library path=\""+item+"\"/>";
			});
            // xml+=self.remark.toXml();
			try{
				for(var i=0;i<self.rules.length;i++){
					var rule=self.rules[i];
					xml+=rule.toXml();
				}
			}catch(error){
				console.log(error);
				MsgBox.alert(error);
				return;
			}
			xml+="</rule-set>";
			console.log(xml);
			// let postData={content:xml,file,newVersion};
			// const url=window._server+'/common/saveFile';
			// if(newVersion){
			// 	bootbox.prompt("请输入新版本描述.",function (versionComment) {
			// 		if(!versionComment){
			// 			return;
			// 		}
			// 		postData.versionComment=versionComment;
			// 		ajaxSave(url,postData,function () {
			// 			
			// 		})
			// 	});
			// }else{
			// 	ajaxSave(url,postData,function () {
			// 		
			// 	})
			// }
		}
		function _addRule(data){
			var ruleContainer=$("<div class='well' style='margin:5px;padding:8px'></div>");
			self.append(ruleContainer);
			var rule=new urule.Rule(self,ruleContainer,data);
			self.rules.push(rule);
			
			return rule;
		};
		function _addLoopRule(data){
			var ruleContainer=$("<div class='well' style='margin:5px;padding:8px;border-color:#337AB7'></div>");
			self.append(ruleContainer);
			var rule=new urule.LoopRule(self,ruleContainer,data);
			self.rules.push(rule);
			
			return rule;
		};

		function _loadRulesetFileData(){
			setTimeout(function(){
				window.refreshVariableLibraries();
				window.refreshParameterLibraries();
				// var rule=_addRule();
				// rule.initTopJoin();
				_addRule({
					"name": "rule",
					"lhs": {
						"criterion": {
							"criterions": [
								{
									"op": "GreaterThen",
									"left": {
										"leftPart": {
											"variableName": "uuu",
											"variableLabel": "uuu",
											"variableCategory": "test",
											"datatype": "String"
										},
										"type": "variable"
									},
									"value": {
										"content": "4444",
										"valueType": "Input"
									},
									"necessaryClassList": []
								},
								{
									"op": "GreaterThen",
									"left": {
										"leftPart": {
											"variableName": "kkk",
											"variableLabel": "kkk",
											"variableCategory": "test",
											"datatype": "String"
										},
										"type": "variable"
									},
									"value": {
										"content": "000",
										"valueType": "Input"
									},
									"necessaryClassList": []
								},
								{
									"op": "GreaterThen",
									"left": {
										"leftPart": {
											"keyName": "test1",
											"variableName": "uuu",
											"variableLabel": "uuu",
											"variableCategory": "t1",
											"datatype": "String"
										},
										"type": "parameter"
									},
									"value": {
										"content": "444",
										"valueType": "Input"
									},
									"necessaryClassList": []
								}
							],
							"junctionType": "and"
						}
					},
					"rhs": {
						"actions": []
					},
					"other": {},
					"loopRule": false,
					"remark": "",
					"withElse": false
				});
			}, 1000)
			// var url=window._server+'/common/loadXml';
			// $.ajax({
			// 	url:url,
			// 	type:'POST',
			// 	data:{files:file},
			// 	error:function(req,error){
			// 		MsgBox.alert("加载文件失败！");
			// 	},
			// 	success:function(data){
			// 		var ruleset=data[0];
			// 		var libraries=ruleset["libraries"];
            //         // self.remark.setData(ruleset["remark"]);
			// 		if(libraries){
			// 			for(var i=0;i<libraries.length;i++){
			// 				var lib=libraries[i];
			// 				var type=lib["type"];
			// 				var path=lib["path"];
			// 				switch(type){
			// 				case "Constant":
			// 					constantLibraries.push(path);
			// 					break;
			// 				case "Action":
			// 					actionLibraries.push(path);
			// 					break;
			// 				case "Variable":
			// 					variableLibraries.push(path);
			// 					break;
			// 				case "Parameter":
			// 					parameterLibraries.push(path);
			// 					break;
			// 				}
			// 			}
			// 		}
			// 		refreshActionLibraries();
			// 		refreshConstantLibraries();
					
			// 		
			// 		refreshFunctionLibraries();
			// 		var rules=ruleset["rules"];
			// 		for(var i=0;i<rules.length;i++){
			// 			var rule=rules[i];
			// 			if(rule.loopRule){
            //                 _addLoopRule(rule);
            //             }else{
            //                 _addRule(rule);
            //             }
			// 		}
			// 		
			// 	}
			// });
		}
		
	};
})(jQuery);
