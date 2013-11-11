module.exports = {

  name: "large-viewstate",

  config: {
    //Warn if more than 50 KB in total size 
    sizeInKB: 50
  },

  func: function(listener, reporter, config) {

    var viewStateCount = 0
      , viewStateSize = 0

    // register a handler for the `attribute` event
    listener.on('attribute', function(name, value, element) {
      //Total no. of characters in value attribute of all <input type="hidden" name="__VIEWSTATE"> tags should not be more than 50 (config value)
      if (name=="name" && value.indexOf("__VIEWSTATE")===0 && value!== "__VIEWSTATEFIELDCOUNT") {
        viewStateCount++
        viewStateSize += element.getAttribute("value").length
      }
    })

    listener.on("afterInspect", function() {
      
      if (viewStateSize > config.sizeInKB * 1024) {

        reporter.warn(
            "large-viewstate",
            viewStateSize/1024 + " KB is being used in " + viewStateCount + " chunk(s) of View State.",
            "Disable View States where not needed for better performace."
        )
      }  

    })
  }
}
