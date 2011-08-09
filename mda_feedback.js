/**
 * @file mda_feedback.js
 */

var last_x, last_y;
var highlight_box = '';
var mouseup_submit = false;

function mda_feedback(event) {
	jQuery('#mda-feedback-inner').toggleClass('active',250);
	return false;
}
function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
function startHighlight() {
	var fb_select = jQuery('#feedback-select');
	
	jQuery('body').css('margin-top', '0px !important');
	jQuery('#admin-menu').css('display', 'none');
	jQuery('body').css('cursor', 'crosshair');
	jQuery('body').css('position', 'relative');
	fb_select.css('display','none');
	
	jQuery('body').mousedown(function(e){
	var select = jQuery('#feedback-select');
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	last_x = x;
	last_y = y;

	select.css('left',last_x+'px');
	select.css('top',last_y+'px');
	select.css('width','1px');
	select.css('height','1px');
	select.css('display','block');
	
	jQuery('body').mouseup(function(e){
		jQuery('body').css('cursor', 'auto');
	
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		
		jQuery('body').unbind(e);
		jQuery('body').unbind('mousedown');
		jQuery('body').unbind('mousemove');
		
		highlight_box = fb_select.css('top') + ',' + fb_select.css('left') + ',' + fb_select.css('width') + ',' + fb_select.css('height') + ',' + jQuery('#page-wrapper').css('width');

		jQuery("input[name='submitted[highlight_box]']").val(highlight_box);
		jQuery('#edit-submitted-description').focus();
	});
	
	jQuery('body').mousemove(function(e){
		var x = e.pageX;
		var y = e.pageY;
		var height = 0, width = 0, top = 0, left = 0;
		if(x > last_x) {

			left = last_x;
			width = x - last_x;
			
		}	else {
			
			left = x;
			width = last_x - x;
			
		}
		if(y > last_y) {
			top = last_y;
			height = y - last_y; 
		} else {
			top = y;
			height = last_y - y; 
		}
		jQuery('#feedback-select').css('top',top+'px');
		jQuery('#feedback-select').css('left',left+'px');
		jQuery('#feedback-select').css('width',width+'px');
		jQuery('#feedback-select').css('height',height+'px');
	});
	
	return false; // disable text select
	});
}
function drawHighlight() {
	var args = getUrlVars();
	var fb_select = jQuery('#feedback-select');

	var position = args['highlight'].split(',');

	jQuery('body').css('margin-top', '0px !important');
	fb_select.css('top',position[0]);
	fb_select.css('left',position[1]);			
	fb_select.css('width',position[2]);
	fb_select.css('height',position[3]);
	fb_select.css('background-color','rgba(255, 0, 0, 0.1)');
	fb_select.css('display','block');
	fb_select.html('<div style="padding:5px;">'+unescape(args['description'].replace(/\+/g, " "))+'</div>');
	jQuery('body').css('position', 'relative');
	jQuery('body').css('width',position[4]);
	jQuery('body').css('margin','0 auto');
}

jQuery(document).ready(function() { 
	jQuery.ajax({
		url: jQuery('#mda-feedback-inner .give-fb').attr('href'),
    cache: false,
    dataType: "html",
    success: function(data) {
			jQuery("#mda-feedback-webform").html( jQuery(data).find('.webform-client-form'));
			
			jQuery('input[name="submitted[path]"]').val(window.location.href);
			jQuery('input[name="submitted[client]"]').val(navigator.userAgent);
    }
	});
	jQuery('#mda-feedback-inner .give-fb').click(mda_feedback);
	jQuery('#mda-feedback-highlight').click(startHighlight);
	
	try {
		drawHighlight();
	} catch(e) {		
	}
});
