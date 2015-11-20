describe("DashBoard", function() {

    it("testing game preview functionality", function () {

        loadFixtures('dashboard.html');

        jasmine.Ajax.install();

        var doneFn = jasmine.createSpy("success");

        
        jasmine.Ajax.stubRequest('/created_games').andReturn({
            "status": 200,
            "responseText": '{"id": 3, "game_template_id": 1, "description": "description"}'
        });
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(args) {
            if (this.readyState == this.DONE) {
                doneFn(this.status);
                json = JSON.parse(this.responseText);
                $('<li id="' + json.id + '"><a id="test_click" class="game_item" href="' + json.description + '">' + json.description + '</a></li>').appendTo('#games_list');
            }
        };

        xhr.open("GET", "/created_games");
        xhr.send();

        expect(doneFn).toHaveBeenCalledWith(200);

        jasmine.Ajax.uninstall();

    });

});
