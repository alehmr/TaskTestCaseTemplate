var renderContent = function($contentElement, context) {
		
		var html = '';
		html += '<div class="templates-mashap">';
    		html += '<div class="tm-add-btn" id = "addbutton">Add template</div>';
	        html += '<table class="tm-grid"><tbody></tbody></table>';
        
      		html += '<div id = "table"><div>';
 
    		html += '</div>';
    		
		$contentElement.append(html);

	}

        
        
        
tau.mashups.addDependency('tp/userStory/view')
    
    .addMashup(function (view) {
        view.addTab('Template', renderContent)
          
    });
    
    tau.mashups 
    .addDependency('app.bus') 
    .addDependency('tau/configurator')
    .addMashup(function ($deferred, configurator) { 
 	
               
var applyTemplate = function() {
                                
                addCSS();
    
		console.log('hello');
      
      	
		
		this.init = function() {
			
			this._userstoryid = 0;
			$deferred.then(function(bus) {
				//TODO: Need to use a better event ?
                                       
				bus.on('afterRenderAll', function(evt, data) {
					
					if (evt.caller.name == "container") {
                                        	                                     
						if (typeof data.data.context.entity !== 'undefined') {
							debug("=== Start Event Information");
                      					debug(evt);
                      					debug(data.data.children);
                          				debug(data.data.children.length);
                      					debug("=== End Event Information");
                            
                            				if(data.data.children.length > 0){
                                                                if( data.data.children[0].name.indexOf("Template") != -1) {
                                                                        //Only run on the template tab
									startApplyTemplate(data);
                              					}
                              				}
						}
					}

				});


			})

		};






		startApplyTemplate = function(eventdata) {
                                                          
		console.log("event");
                $element = eventdata.element;
                
                $element.find('.tm-add-btn').click(function(){
                
                      	addNewTemplate();
                	console.log("Hiya!");
                                                  
		});
                
                buildTemplateTable($element);
                
		};
                
                
                buildTemplateTable = function($element){
                       
                  
			$element.find(".tm-grid > tbody").html('');
        		buildTable($element.find(".tm-grid > tbody"));
                	
                                                
                                                
                };
                
                rebuildTemplateTable = function(){
                  
                  
	                $(".tm-grid > tbody").html('');
                    	buildTable($(".tm-grid > tbody"));
                  	
                	                             
		};
         
                
                buildTable = function($table){
                
                $.ajax({
                        
                type: 'GET',
                url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/?where=(scope == "Public")&select={publicData,key}',
                async: false,
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                        console.log(data);                 
                                        $.each(data.items, function(k,item) {

	     
                                                
                              			$table.append(buildInfoRow(item));
                                                $table.append(buildEditRow(item));
                                		
                                		console.log(item.key);
                                  		console.log(item.publicData);
//                                              //console.log();
                                
				        });    
                                        
				}
                });
                                        
           
		};
                
                
                buildInfoRow = function(item){
                
                //setup elements for info table row
			var infotr = $('<tr class="info-line"></tr>');
			
                    	//controls when template name is clicked.

			infotr.append($('<td class="td-name"><div class="tm-name"></div></td>').click(function() {                                                                                                                                                                      
							
				$(this).parent().siblings(".info-line").removeClass('active');                                                                                                                                                                                                          
                                $(this).parent().addClass("active");
                                $(this).parent().siblings(".edit-line").removeAttr('style');                                                                                                                                                                                                                                        
                                $(this).parent().next().css("display","table-row");
          	      		debug("Template TD Clicked");
			}));
                                		
                                                
                        //Used for changing template name
                                            
                       var templatename = $('<span contenteditable="false">' + item.publicData.name + '</span>').click(function() {
                       
			//Only enable when edit line is visible
                                                        if($(this).parents(".info-line").next().css('display') != "none"){
								$(this).parent().addClass("edit-mode");                                                                                                              
							        $(this).attr('contentEditable', true);
	                                              		//$(this).focus();
								debug("Template Span Clicked - Editing Enabled");
                                                  	}
                                              
						    }).blur(function() {
                                                                        
                                                        $(this).parent().removeClass("edit-mode");  
                                                	$(this).attr('contentEditable', false);
                                                        debug("Template Name Exited, Save Name Changes" + item.key);
                                                    
                                                    	item.publicData.name = $(this).text();
                                                      
                                                        saveTemplate(item.publicData, item.key);
					                
                                                  
					        }).keypress(function(e) {
                                                                         
    							if(e.which == 13) {
                                                                $(this).parent().removeClass("edit-mode");  
                                                		$(this).attr('contentEditable', false);
							        debug("Enter Key Pressed, Save Name Changes " + item.key);
                                                    		item.publicData.name = $(this).text();
	                                                        saveTemplate(item.publicData, item.key);
                                                            }
					    	});
                                                
			infotr.find(".tm-name").append(templatename);
                                                
			infotr.append('<td class="td-entities"><span class="entity-icon entity-task">T</span><span class="counter">' + item.publicData.taskCount + '</span></td>');
			
                        infotr.append('<td class="td-entities"><span class="entity-icon entity-test-case">TC</span><span class="counter">' + item.publicData.testCaseCount + '</span></td>');
                                    		  		
			var actions = $('<td class="td-actions"></td>');
                                      	
			actions.append($('<button class="tau-btn tau-attention">Delete</button>').click(function() {
				removeTemplate(item.key);
				debug("Delete button pressed");
			}));
                                          
                                          	
			actions.append($('<button class="tau-btn tau-primary">Apply template</button>').click(function() {
				console.log("Apply!");
                               	debug(item);                                                                               
                                                                                                              
                                                                                                              
			}));
                                          
			infotr.append(actions);                   
                
			return infotr;     
		};
                

                buildEditRow = function(item){
                                              
                        var edittr = $('<tr class="edit-line"></tr>');                                                  
                        edittr.append(buildTasks(item));
			edittr.append(buildTestCases(item));                              
                                              
                 	return(edittr);                             
		};
                
                
                /*
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		 Start of TASK actions
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		*/
                
                buildTasks = function (item){
                                               	 
                                                
                                              
			
			var tasktd = $('<td class="td-task" colspan="3"></td>');                        
   			tasktd.append('<div class="tm-caption"><b class="task">Tasks</b><span class="counter">' + item.publicData.taskCount + '</span></div>');
                                                
                                                
                                                

                                                
                                                var newtask = $('<button class="tau-btn tau-btn-small tau-success"></button>').click(function() {
                                                	
                                                                                                                                     
                                                                                                                                     
                                                                                                                                     
                                                                                                                                 
                                                        //build object for when a new task is created.                                                                             
                                                        var taskline = $('<div class="tm-item"></div>').click(function(){
                                                        	//console.log('tm-item clicked');
                                                        });
                                  
                                                        taskline.append('<div class="view-mode active"><div class="entity-name placeholder"></div><div class="edit-block"><div class="note">Description</div><div class="description" contenteditable="true"></div><div class="action-buttons"></div></div></div>');                                                                             
                                                        
                                      			$(this).parent().parent().children('.tm-body').prepend(taskline);
                                                       	
                                        		
                                        
                                        		$(this).attr("disabled", true);
                                        		
                                            		var taskname = $('<span contenteditable="true">Name</span>').click(function() {
                                                                                                                           
                                                                if($(this).parents('.entity-name').hasClass("placeholder")){                                                          
                                                                	$(this).text('');
			                                                $(this).parents('.entity-name').removeClass('placeholder');
                                              				debug('TaskName Clicked'); 
                                                			
                                              			}
                                                                                                                           
                                                		                                                                                  
							});
                                              	
                                                	
                                                
                                                	$(this).parents('.td-task').find('.entity-name.placeholder').first().append(taskname);
                                                
                                            
                                        		var addtask = $('<button class="tau-btn tau-success left">Add task</button>').click(function() {
                                                                
                                                                debug('Add Task Clicked');                                                                            
                                                                var taskname = $(this).parents('.tm-item').find('.entity-name > span').text();
                                                		var taskdesc = $(this).parents('.edit-block').children('.description').text();
                                                                
                                                    		//TODO: Make sure they are not blank
                                                                if(true){
                                                                        var tasks = $.parseJSON(item.publicData.tasks); 
                                                        		tasks.push({"Name" : taskname,"Description" : taskdesc, "Id": getNewID()});
                                                        		
									debug(tasks);
                               
                                                            		saveTasks(tasks, item);
                                                                	//enable the add buttton
                                                               		$(this).parents('.td-task').find('.tm-caption > button').attr("disabled",false);
									$(this).parents('.tm-item').children('.view-mode').removeClass("active");
                                                                  	//Update Task Counts
                                                                	$(this).parents('.td-task').find('.counter').text(item.publicData.taskCount);
                                                                    	$(this).parents('.edit-line').prev().find('.td-entities > .entity-task').next().text(item.publicData.taskCount);
                                                                    	//Remove the old actions
                                                                        tasktd.find('.action-buttons').first().html();
                                                                        //Add the actions for the new line
                                                                        tasktd.find('.action-buttons').first().append(buildSaveTask());
                                                                        tasktd.find('.action-buttons').first().append(buildDeleteTask());
                                                                	
                                                                }                                                                                
                                                                                                                                            
							});
                                                
							var canceltask = $('<button class="tau-btn tau-attention right">Cancel</button>').click(function() {
								debug('Cancel Task Clicked');
                                                                //TODO:  Have cancel enable button newtask
	                                                        $(this).parents('.td-task').find('.tm-caption > button').attr("disabled",false);
	                                                       	$(this).parents('.tm-item').remove();
							});
                                                
                                                	tasktd.find('.action-buttons').first().append(addtask);
                                                	tasktd.find('.action-buttons').first().append(canceltask);                                                  	
                                                
							
	                                               
                                                });
                                                
                                                tasktd.children('.tm-caption').append(newtask);
                                        	
                                                
                                                
	                                        
                                                
                                                
                                                
                                                var tasks = $.parseJSON(item.publicData.tasks);
                                                debug('=== Start Task List ===');
                                                debug(tasks);
                                               	debug('=== End Task List==='); 
                                                
                                                debug('=== Start Build Task List===');
                                                
                                                var taskitem;
                                                tasktd.append('<div class="tm-body"></div>');
                                                
                                                for (var i = 0; i < tasks.length; i++) {
    							
                                                	var task = tasks[i];
                                                  	tasktd.children('.tm-body').append(buildTask(item, task));                                                	
                                                    
						}
                                                
                                                debug('=== End Build Task List==='); 
                                                
                                                
			return tasktd;
                                             
		};
                
                
                buildSaveTask = function(item, task){
 			var savetask = $('<button class="tau-btn tau-success left">Save task</button>').click(function() {
                                                                
				debug('Save Task Clicked');                                                                            
					var taskname = $(this).parents('.tm-item').find('.entity-name > span').text();
					var taskdesc = $(this).parents('.edit-block').children('.description').text();
					
                      			//TODO: Make sure they are not blank
					if(true){

						//saveTasks(tasks, item.key, item.publicData);
                                                               		
						$(this).parents('.tm-item').children('.view-mode').removeClass("active");

                                                                    	
                                                                	
					}                                                                                
                                                                                                                                            
			});
                        
                        
                        return savetask;
                                           
		};
                
                
                buildDeleteTask = function(item, task){
			var deletetask = $('<button class="tau-btn tau-attention right">Delete</button>').click(function() {
				debug('Delete Task Clicked');
                                
                                //$(this).parents('.td-task').find('.tm-caption > button').attr("disabled",false);
                               	
                   		var tasks = $.parseJSON(item.publicData.tasks);
                      		
                        
                        	var found = -1;
                        	for (var i = 0; i < tasks.length; i++) {
    							
                                    if (tasks[i].Id == task.Id){
                                    	debug("removing " + i + "  " + tasks[i].Name);
                            		found = i;
                              		break;
				    }
                                                  	                                                	
                                                    
				}
                      		
                                
                                if(found >= 0){
                                               
                	                tasks.splice(found,1);
                                	
        	                        saveTasks(tasks, item);
                                                                	
					$(this).parents('.tm-item').children('.view-mode').removeClass("active");
					//Update Task Counts
                                        debug($(this).parents('.td-task').find('.counter'));
	                        	$(this).parents('.td-task').find('.counter').text(item.publicData.taskCount);
					$(this).parents('.edit-line').prev().find('.td-entities > .entity-task').next().text(item.publicData.taskCount);
                                        $(this).parents('.tm-item').remove();                            	
				}
                    		
                    		console.log(item, task);
			});
                        
                        
                       
                        
                        return deletetask;
                                             
		};
                
                buildTask = function(item, task){
                                           
                 	taskitem = $('<div class="tm-item"></div>').click(function(){
                        
                                                                          
					
                  			if(!($(this).find('.view-mode').hasClass("active"))){
                                                //debug($(this).parents('.tm-item'));
                    
                    				debug("task item clicked (gogo edit mode)"); 
                    			
                    
                                                $(this).parents('.tm-body').find('.view-mode:not(:has(.entity-name.placeholder))').removeClass('active');
                                                                                           		
                                        	$(this).find('.view-mode').addClass("active");    
                    			}
                        });    
                
                
                	taskitem.append('<div class="view-mode"><div class="entity-name"><span>' + task.Name  + '</span></div><div class="edit-block"><div class="note">Description</div><div class="description" contenteditable="true">' + task.Description + '</div><div class="action-buttons"></div></div></div>');

                                                

                                                
                      	taskitem.find('.action-buttons').append(buildSaveTask(item, task));
                        taskitem.find('.action-buttons').append(buildDeleteTask(item, task));
                  	
                        return taskitem;                   
		};
                
                /*
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		 Start of TESTCASE actions
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		*/                
                
                buildTestCases = function(item){
                                                 
			var testcasetd = $('<td class="td-test-case"></td>');                                                 
                	testcasetd.append('<div class="tm-caption"><b class="test-case">Test Cases</b><span class="counter">' + item.publicData.testCaseCount + '</span><button class="tau-btn tau-btn-small tau-success"></button></div><div class="tm-body"><div class="tm-item"><div class="view-mode"><div class="entity-name"><span>Quick link to states settings from board</span></div><div class="edit-block">[edit mode...]</div></div></div><div class="tm-item"><div class="view-mode"><div class="entity-name"><span>Quick link to states settings from board</span></div><div class="edit-block">[edit mode...]</div></div></div><div class="tm-item"><div class="view-mode"><div class="entity-name"><span>Quick link to states settings from board</span></div><div class="edit-block">[edit mode...]</div></div></div></div>');                                 
                  
                  	return testcasetd;
                  
		};

                /*
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		 Start of Add New Template
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		*/
                
                addNewTemplate = function(){
                	
                		var savedata = {  };
                        	//savedata["Tasks"] = { };
                    		savedata["Tasks"] = '[]';
                		savedata["Name"] = 'New Template';
	                        savedata["TaskCount"] = '0';
	                        savedata["TestCaseCount"] = '0';
                            	
                          	
                            	console.log(savedata);
                          	console.log(JSON.stringify(savedata));
                
                    		$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/',
		                        data: JSON.stringify({
                                        'key'       : '',                   
                        		'scope'     : 'Public',
                        		'publicData': savedata,
                        		'userData'  : null
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        debug("yay!");
                        		rebuildTemplateTable();
                      		}, 
       		    		error: function(){
                                        debug("boo!");}
                		});
                
                                 
		};
                
                
                saveTasks = function(newtasks, item){
        		
                	var key = item.key
                
                	item.publicData.taskCount = newtasks.length.toString();
                      	newtasks = JSON.stringify(newtasks);
                	item.publicData.tasks = newtasks;
                	saveTemplate(item.publicData, key);
                                                              
		};
                
                
                
                saveTemplate = function(savedata, key){
                		
                
	                        
                        	debug('======');
                          	debug('saving');
                              	debug(savedata);
                        	debug('======');
                
                    		$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/',
		                        data: JSON.stringify({
                                        'key'       : key,                   
                        		'scope'     : 'Public',
                        		'publicData': savedata,
                        		'userData'  : null
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        debug("yay!");
                          		return true;
                      		}, 
       		    		error: function(){
                                        debug("boo!");
                                	rebuildTemplateTable();
                                  	return false;
                                }
                		});
                
                                 
		};
                
                
                
		/*
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		 Start of Remove Template
		 =-=-=-=-=-=-=-=-=-=-=-=-=-
		*/
                
                function removeTemplate(templatename){
        
                                              
                                              
          	  	console.log('remove template' + templatename);
                
                        $.ajax({
                                    type: 'DELETE',
                                    url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + templatename,
                                    contentType: 'application/json; charset=utf8',
                                    success: function(){debug("yay!");
                                                        rebuildTemplateTable();
                                                        }, 
                                    error: function(){debug("boo!");}
                                });
          
	        };
                
             
                
                
        function getNewID(){
                            
		var d = new Date();
        
        	s = d.getTime();
        
        	return s;
        
        };
                
                


	/*
        fix the input from the text boxes
        */
		function fixInput(s) {

			s = s.replace(/"/gm, '"');
			s = s.replace(/>/gm, '>');
			s = s.replace(/</gm, '<');
			//s = s.replace(/'/gm, ''');
			s = s.replace(/(\r\n|\n|\r)/gm, '\n');
			s = s.replace(/(\r\n|\n|\r)/gm, '<br />');
			return s;
		}

		function debug(message){
                
               		if(true){
                        	console.log(message);         
			}
                
                };



	};




new applyTemplate().init();

});


function addCSS(){

console.log('adding css');



$('head').append('<style type="text/css">'
+'.templates-mashap { padding: 20px 0 20px 20px; font-size: 13px; font-family: OpenSans, Arial, Helvetica, sans-serif; color: #16343b;}'
+'.templates-mashap .tm-add-btn {cursor: pointer; display: inline-block; vertical-align: top; position: relative; color: #8bb648; font-size: 14px; font-weight: 600; line-height: 26px; padding: 0 8px 0 24px; margin-bottom: 10px; border-radius: 2px; }'
+'.templates-mashap .tm-add-btn:before { content: ""; display: block; width: 10px; height: 10px; background: url("../JavaScript/tau/css.board/images/icons-general.svg") -60px -109px no-repeat; position: absolute; top: 8px; left: 8px; }'
+'.templates-mashap .tm-add-btn:hover { background-color: #e6eef8; color: #8596a7; }'
+'.templates-mashap .tm-add-btn:hover:before {background-position: -110px -109px;}'
+'.templates-mashap .tm-grid {width: 100%;border-spacing:0;border-collapse:collapse;table-layout: fixed;}'
+'.tm-grid td {vertical-align: top;padding: 4px 5px;}'
+'.tm-grid .td-name {width: 42%;}'
+'.tm-grid .td-entities {width: 4%;color: #8596a7;font-size: 11px;white-space: nowrap;padding-top: 8px;}'
+'.tm-grid .td-actions {text-align: right;width: 50%;}'
+'.tm-grid .info-line.active td,'
+'.tm-grid .info-line:hover td {background-color: #e6eef8;}'
+'.tm-grid .info-line:hover td {cursor: pointer;}'
+'.tm-grid .td-name {padding: 0 20px 0 0;}'
+'.tm-grid .td-name .tm-name {display: inline-block;position: relative;padding: 7px 22px 6px 26px;max-width: 100%;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;line-height: 0;}'
+'.tm-grid .td-name .tm-name span {display: inline-block;line-height: 20px;height: 20px;max-width: 100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}'

+'.tm-grid .td-name .tm-name:before {content: "";display: block; background: url("../JavaScript/tau/css.board/images/icons-general.svg") -110px -160px no-repeat; width: 11px;height: 11px;position: absolute;top: 11px;left: 8px;}'
+'.tm-grid .active .td-name .tm-name:before {background-position: -60px -160px;}'
+'.tm-grid .td-name .tm-name:hover {color: #8596a7;}'
+'.tm-grid .info-line.active .tm-name {color: #16343b;font-weight: 600;}'
+'.tm-grid .td-name .tm-name:hover span:after {content: "";height: 0;display: block;border-bottom: dotted 1px #49626a;width: 100%;margin-top: -1px;}'
+'.tm-grid .info-line.active .tm-name:hover span:after {display: none;}'
+'.tm-grid .info-line.active .tm-name:hover:after {content: ""; background: url("../JavaScript/tau/css/images/edit.png") 0 0 no-repeat; width: 20px;height: 12px;position: absolute;top: 11px;right: 0;}'

+'.tm-grid .active .tm-name.edit-mode span {background-color: #fff;border: solid 1px #cbd1d6;border-top-color: #a3a7ab;padding: 0 2px;min-width: 150px;}[contenteditable]:focus {outline: none;}'
+'.tm-grid .td-actions .tau-btn {opacity: 0;-moz-transition: opacity 0.2s linear;-webkit-transition: opacity 0.2s linear;transition: opacity 0.2s linear;}'
+'.tm-grid .info-line:hover .td-actions .tau-primary,'
+'.tm-grid .info-line.active .td-actions .tau-primary {opacity: 1;}'
+'.tm-grid .td-actions .tau-btn.tau-attention {opacity: 0;visibility: hidden;-moz-transition: opacity 0.2s linear;-webkit-transition: opacity 0.2s linear;transition: opacity 0.2s linear;}'
+'.tm-grid .info-line.active .td-actions .tau-attention {opacity: 1;visibility: visible;}'
+'.tm-grid .edit-line {display: none;}'
+'.templates-mashap .entity-icon {    border-radius: 2px;    display: inline-block;    margin: 0 0.2em;    min-width: 12px;    padding: 1px 2px;    text-align: center;    text-transform: uppercase;vertical-align: middle;}'
+'.templates-mashap .td-entities .counter {vertical-align: middle;display: inline-block;padding: 0 5px 0 2px;}'
+'.templates-mashap .entity-icon.entity-task {    background-color: #e8e8f0;    color: #445566;}'
+'.templates-mashap .entity-icon.entity-test-case {    background-color: #f8e4ce;    color: #dd7709;}'
+'.tm-grid .edit-line td {background-color: #f2f6fb;padding: 15px 15px 15px 18px;}'
+'.tm-grid .edit-line .tm-caption {padding: 0 0 6px 8px;font-size: 11px;color: #a0a0a8;}'
+'.tm-grid .edit-line .tm-caption b {font-weight: 600;display: inline-block;vertical-align: middle;text-transform: uppercase;letter-spacing: 1px;margin-right: 6px;}'
+'.tm-grid .edit-line .tm-caption b.task {color: #191970;}'
+'.tm-grid .edit-line .tm-caption b.test-case {color: #dd7709;}'
+'.tm-grid .edit-line .tm-caption .counter {padding: 0 6px;border-radius: 6px;border: solid 1px #c7ccd2;display: inline-block;vertical-align: middle;line-height: 12px;margin-right: 8px;}'
+'.tm-grid .edit-line .tm-caption .tau-btn {width: 18px;height: 18px;position: relative;}'
+'.tm-grid .edit-line .tm-caption .tau-btn:after {content: "";display: block;width: 10px;height: 11px;position: absolute;top: 2px;left: 3px;background: url("../JavaScript/tau/css.board/images/icons-general.svg") -10px -108px no-repeat; }'
+'.tm-grid .edit-line .tm-item .view-mode:hover {background-color: #fff;}'
+'.tm-grid .edit-line .tm-item .view-mode .entity-name {line-height: 0;padding: 5px 8px;}'
+'.tm-grid .edit-line .tm-item .view-mode .entity-name:hover {cursor: pointer;}'
+'.tm-grid .edit-line .tm-item .view-mode.active .entity-name:hover {cursor: default;}'
+'.tm-grid .edit-line .tm-item .view-mode .entity-name span{display: inline-block;line-height: normal;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;max-width: 100%;border-bottom: dotted 1px #f2f6fb;}'
+'.tm-grid .edit-line .tm-item .view-mode:hover .entity-name span {border-bottom: dotted 1px #50666b;color: #8596a7;}'
+'.tm-grid .edit-line .tm-item .edit-block {display: none;padding: 0 8px 10px 8px;}'
+'.tm-grid .edit-line .tm-item .active .edit-block {display: block;margin-bottom: 5px;}'
+'.tm-grid .edit-line .tm-item .active {background-color: #fff;}'
+'.tm-grid .edit-line .tm-item .active .entity-name {padding: 8px;}'
+'.tm-grid .edit-line .tm-item .active .entity-name span,'
+'.tm-grid .edit-line .tm-item .active:hover .entity-name span {background-color: #fff;border: solid 1px #cbd1d6;border-top-color: #a3a7ab;padding: 2px 7px;min-width: 150px;color: #16343b;font-weight: 600;display: block;height: 18px;line-height: 18px;}'
+'.tm-grid .edit-line .tm-item .active .entity-name.placeholder span{font-weight: normal;color: #acb6bf;}'
+'.tm-grid .edit-line .description {background-color: #fff;border: solid 1px #cbd1d6;border-top-color: #a3a7ab;padding: 7px;min-width: 150px;color: #16343b;display: block;line-height: 16px;min-height: 55px;}'
+'.tm-grid .edit-line .note {font-size: 11px;color: #acb6bf;padding-top: 8px;padding-bottom: 2px;}'
+'.tm-grid .edit-line .action-buttons {padding-top: 10px;overflow: hidden;}'
+'.tm-grid .edit-line .action-buttons .tau-btn.left {float: left;}'
+'.tm-grid .edit-line .action-buttons .tau-btn.right {float: right;}'

+'</style>');
};
