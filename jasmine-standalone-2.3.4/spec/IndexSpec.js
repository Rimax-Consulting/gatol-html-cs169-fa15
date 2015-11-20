describe("Index buttons", function() {

    // fixtures automatically clean up between tests

    it("should initially show only select screen", function() {
        loadFixtures('index.html');  
        expect($('#select_screen')).toHaveCss({display: "block"});
        expect($('#login_screen')).toHaveCss({display: "none"});
        expect($('#trainer_login_screen')).toHaveCss({display: "none"});
        expect($('#register_screen')).toHaveCss({display: "none"});
        expect($('#forgot_screen')).toHaveCss({display: "none"});
        expect($('#trainer_forgot_screen')).toHaveCss({display: "none"});
        expect($('#register_trainer_screen')).toHaveCss({display: "none"});

    });

    describe("when trainer register button is clicked", function() {

        it("should check that clicks hide select screen and show trainer registration screen", function() {

            loadFixtures('index.html');
            
            $('#register_trainer').click();
            expect($('#select_screen')).toHaveCss({display: "none"});
            expect($('#register_trainer_screen')).toHaveCss({display: "block"});
            
        });

    });

    describe("when student register button is clicked", function() {

        it("should check that clicks hide select screen and show student registration screen", function() {

            loadFixtures('index.html');
            
            $('#register').click();
            expect($('#select_screen')).toHaveCss({display: "none"});
            expect($('#register_screen')).toHaveCss({display: "block"});
            
        });

    });

    describe("when student login button is clicked", function() {

        it("should check that clicks hide select screen and show student login screen", function() {

            loadFixtures('index.html');
            
            $('#student_login').click();
            expect($('#select_screen')).toHaveCss({display: "none"});
            expect($('#login_screen')).toHaveCss({display: "block"});
            
        });

    });

    describe("when trainer login button is clicked", function() {

        it("should check that clicks hide select screen and show trainer login screen", function() {

            loadFixtures('index.html');
            
            $('#trainer_login').click();
            expect($('#select_screen')).toHaveCss({display: "none"});
            expect($('#trainer_login_screen')).toHaveCss({display: "block"});
            
        });

    });

});
