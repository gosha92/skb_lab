class UrlMappings {

	static mappings = {
        "/"(controller: "contact", action: "index")
        "/contact"(resources: "contact", excludes: ["index", "create", "edit", "patch"])
        "/upload"(controller: "contact", action: "upload")
	}
}
