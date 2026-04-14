has("layout") and
(.layout | type == "string") and
(.layout == "post") and
has("title") and
(.title | type == "string") and
(.title | length > 0) and
has("description") and
(.description | type == "string") and
(.description | length >= 50) and
(.description | length <= 300) and
has("date") and
(.date | tostring | test("^[0-9]{4}-[0-9]{2}-[0-9]{2}$"))
