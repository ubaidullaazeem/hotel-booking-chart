(function () {
  'use strict';

  describe('Halls Route Tests', function () {
    // Initialize global variables
    var $scope,
      HallsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HallsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HallsService = _HallsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('halls');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/halls');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HallsController,
          mockHall;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('halls.view');
          $templateCache.put('modules/halls/client/views/view-hall.client.view.html', '');

          // create mock Hall
          mockHall = new HallsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hall Name'
          });

          // Initialize Controller
          HallsController = $controller('HallsController as vm', {
            $scope: $scope,
            hallResolve: mockHall
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:hallId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.hallResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            hallId: 1
          })).toEqual('/halls/1');
        }));

        it('should attach an Hall to the controller scope', function () {
          expect($scope.vm.hall._id).toBe(mockHall._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/halls/client/views/view-hall.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HallsController,
          mockHall;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('halls.create');
          $templateCache.put('modules/halls/client/views/form-hall.client.view.html', '');

          // create mock Hall
          mockHall = new HallsService();

          // Initialize Controller
          HallsController = $controller('HallsController as vm', {
            $scope: $scope,
            hallResolve: mockHall
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.hallResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/halls/create');
        }));

        it('should attach an Hall to the controller scope', function () {
          expect($scope.vm.hall._id).toBe(mockHall._id);
          expect($scope.vm.hall._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/halls/client/views/form-hall.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HallsController,
          mockHall;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('halls.edit');
          $templateCache.put('modules/halls/client/views/form-hall.client.view.html', '');

          // create mock Hall
          mockHall = new HallsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Hall Name'
          });

          // Initialize Controller
          HallsController = $controller('HallsController as vm', {
            $scope: $scope,
            hallResolve: mockHall
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:hallId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.hallResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            hallId: 1
          })).toEqual('/halls/1/edit');
        }));

        it('should attach an Hall to the controller scope', function () {
          expect($scope.vm.hall._id).toBe(mockHall._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/halls/client/views/form-hall.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
