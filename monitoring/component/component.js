var Component = false;

// Component requires jQuery for AJAX calls to data-source-url's defined on components
$(function() {
  Component = (function() {

    var Class = function() { }

    Class.registeredComponents = {
      component: Class
    };

    Class.configure = function(tagName) {
      var ComponentClass = Class.registeredComponents[tagName] || false;
      if(ComponentClass) {
        return ComponentClass;
      }
      else {
        ComponentClass = Class.registerComponent(tagName);
      }
      return ComponentClass;
    }

    Class.registerComponent = function(tagName, template) {
      var ComponentClass = Component.create(tagName, template);
      Class.registeredComponents[tagName] = ComponentClass;
      return ComponentClass;
    }

    Class.create = function(elementName, templateElement) {

      var ComponentClass = function(element) {
        this.element = element;
        this.content = $(element).html().trim();
        this.templateKey = "template[tagname={{tagname}}]".replace('{{tagname}}', elementName);
        this.template = templateElement || $(this.templateKey)[0] || false;

        if(!this.template) {
        this.template = this.element.cloneNode(true);
          console.log("Could not find template for " + this.templateKey + ", using: " + $(this.template).html() + " instead.");
        }

        this.copyAttributesFrom(this.template);
        this.copyAttributesFrom(this.element);
        this.init();
        this.refresh();
      }

      ComponentClass.prototype.elementName = elementName;
      ComponentClass.prototype.templateName = elementName + '-template';

      ComponentClass.prototype.copyAttributesFrom = function(element) {
        if(element && element.attributes) {
          for(var i=0; i < element.attributes.length; i++) {
            var attribute = element.attributes[i];
            this[attribute.name] = attribute.value;
          }
        }
      }

      ComponentClass.prototype.init = function() {
        // Reload any data if applicable
        this.render();
      }

      ComponentClass.prototype.preRenderSteps = [];
      ComponentClass.prototype.preRenderStep = function(fn) {
        // Add your own using:
        // Component.register("tagName").preRenderStep(function() { ... });

        var steps = ComponentClass.prototype.preRenderSteps;
        if(fn) {
          steps.push(fn);
        }
        else {
          for(var i=0; i<steps.length; i++) {
            var step = steps[i];
            step.apply(this, []);
          }
        }
        return ComponentClass;
      }

      ComponentClass.prototype.requestDataFromSource = function() {
        var self = this;

        this.dataSourceTemplate = this["data-source-template"] || false;
        this.dataSourceUrl = this["data-source-url"] || ComponentClass.expandTemplate(this, this.dataSourceTemplate) || false;
        this.dataSourceDataType = this["data-source-type"] || "jsonp";
        this.dataSourceData = false;
        this.dataSourceError = false;

        if(!this.dataSourceUrl) {
          return false;
        }

        this.reportDataSourceStatus('Waiting for server response');

        $.ajax({
          url: this.dataSourceUrl,
          dataType: this.dataSourceDataType,
          success: function(data, textStatus) {
            self.data = data;
            self.dataSourceData = JSON.stringify(self.data);
            if(data !== null && typeof data === 'object') {
              for(var property in data) {
                self[property] = data[property];
              }
              if(data.error) {
                self.dataSourceError = data.error;
                self.reportDataSourceStatus("Error checking url: " + self.dataSourceUrl + " : " + JSON.stringify(data.error));
              }
              else {
                self.reportDataSourceStatus("Server responded OK.");
              }
            }
            else {
              self.reportDataSourceStatus(self.dataSourceUrl + " : Endpoint returned unexpected data : " + JSON.stringify(data));
            }
          }
        }).fail(function() {
          self.dataSourceError = true;
          self.reportDataSourceStatus(self.dataSourceUrl + " : Endpoint failed to return any kind of data.");
        });
      }

      ComponentClass.prototype.reportDataSourceStatus = function(message) {
        this.dataSourceStatus = message;
        this.render();
      }

      ComponentClass.prototype.render = function() {
        this.preRenderStep();

        var expandedTemplate = ComponentClass.expandTemplate(this, $(this.template).html());

        $(this.element).html(expandedTemplate).attr('rendered', true);

        Class.scanForComponents(this.element);
      }

      ComponentClass.expandTemplate = function(data, template) {
        if(template) {

          // substitute element content into template
          if(data.content) {
            template = template.replace(/{{content}}/g, data.content);
          }

          // apply handlebar template based on context
          var handlebarsTemplate = Handlebars.compile(template);
          var expandedTemplate = handlebarsTemplate(data);
        }
        return expandedTemplate;
      }

      ComponentClass.expandProperty = function(property, value, template) {
        var expandedTemplate = template;

        if(expandedTemplate) {
          var matcher = new RegExp("{{x}}".replace("x", property), "g");
          expandedTemplate = expandedTemplate.replace(matcher, value);
        }

        return expandedTemplate;
      }

      ComponentClass.prototype.refresh = function() {
        // Prevent timeout leaks
        if(this.refreshTimeoutId) {
          clearTimeout(this.refreshTimeoutId);
        }

        // Loop
        var self = this;
        this.refreshTimeSeconds = this["refresh-time"] || 0;
        if(this.refreshTimeSeconds) {
          this.refreshTimeoutId = setTimeout(function() {
            self.refresh();
          }, this.refreshTimeSeconds * 1000 + Math.random() * 500);
        }

        // Re-load data for the component
        this.requestDataFromSource();
      }

      return ComponentClass;
    }

    Class.registerTemplates = function() {
      var templates = $('template[tagname]').each(function() {
        var template = $(this)[0];
        var tagName = $(this).attr('tagname');

        Class.registerComponent(tagName, template);
      });

      return this;
    }

    Class.scanForComponents = function(rootElement) {

      var items = rootElement.getElementsByTagName("*");
      // Walk the document looking for components to create
      for (var i = 0; i < items.length; i++) {
        var element = items[i];
        var tagName = element.tagName.toLowerCase();
        if(!element.attributes.rendered) {
          var ComponentClass = Class.registeredComponents[tagName] || false;
          if(ComponentClass) {
            new ComponentClass(element);
          }
        }
      }

      return this;
    }

    return Class;
  })();

  Component.registerTemplates().scanForComponents(document.body);
});
