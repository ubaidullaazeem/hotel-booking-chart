(function () {
  'use strict';

  describe('Newbookings Route Tests', function () {
    // Initialize global variables
    var $scope,
      NewbookingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _NewbookingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      NewbookingsService = _NewbookingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('newbookings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/newbookings');
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
          NewbookingsController,
          mockNewbooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('newbookings.view');
          $templateCache.put('modules/newbookings/client/views/view-newbooking.client.view.html', '');

          // create mock Newbooking
          mockNewbooking = new NewbookingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newbooking Name'
          });

          // Initialize Controller
          NewbookingsController = $controller('NewbookingsController as vm', {
            $scope: $scope,
            newbookingResolve: mockNewbooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:newbookingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.newbookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            newbookingId: 1
          })).toEqual('/newbookings/1');
        }));

        it('should attach an Newbooking to the controller scope', function () {
          expect($scope.vm.newbooking._id).toBe(mockNewbooking._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/newbookings/client/views/view-newbooking.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          NewbookingsController,
          mockNewbooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('newbookings.create');
          $templateCache.put('modules/newbookings/client/views/form-newbooking.client.view.html', '');

          // create mock Newbooking
          mockNewbooking = new NewbookingsService();

          // Initialize Controller
          NewbookingsController = $controller('NewbookingsController as vm', {
            $scope: $scope,
            newbookingResolve: mockNewbooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.newbookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/newbookings/create');
        }));

        it('should attach an Newbooking to the controller scope', function () {
          expect($scope.vm.newbooking._id).toBe(mockNewbooking._id);
          expect($scope.vm.newbooking._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/newbookings/client/views/form-newbooking.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          NewbookingsController,
          mockNewbooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('newbookings.edit');
          $templateCache.put('modules/newbookings/client/views/form-newbooking.client.view.html', '');

          // create mock Newbooking
          mockNewbooking = new NewbookingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Newbooking Name'
          });

          // Initialize Controller
          NewbookingsController = $controller('NewbookingsController as vm', {
            $scope: $scope,
            newbookingResolve: mockNewbooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:newbookingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.newbookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            newbookingId: 1
          })).toEqual('/newbookings/1/edit');
        }));

        it('should attach an Newbooking to the controller scope', function () {
          expect($scope.vm.newbooking._id).toBe(mockNewbooking._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/newbookings/client/views/form-newbooking.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
