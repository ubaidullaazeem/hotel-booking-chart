(function () {
  'use strict';

  describe('Eventtypes Route Tests', function () {
    // Initialize global variables
    var $scope,
      EventtypesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EventtypesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EventtypesService = _EventtypesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('eventtypes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/eventtypes');
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
          EventtypesController,
          mockEventtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('eventtypes.view');
          $templateCache.put('modules/eventtypes/client/views/view-eventtype.client.view.html', '');

          // create mock Eventtype
          mockEventtype = new EventtypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventtype Name'
          });

          // Initialize Controller
          EventtypesController = $controller('EventtypesController as vm', {
            $scope: $scope,
            eventtypeResolve: mockEventtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:eventtypeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.eventtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            eventtypeId: 1
          })).toEqual('/eventtypes/1');
        }));

        it('should attach an Eventtype to the controller scope', function () {
          expect($scope.vm.eventtype._id).toBe(mockEventtype._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/eventtypes/client/views/view-eventtype.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EventtypesController,
          mockEventtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('eventtypes.create');
          $templateCache.put('modules/eventtypes/client/views/form-eventtype.client.view.html', '');

          // create mock Eventtype
          mockEventtype = new EventtypesService();

          // Initialize Controller
          EventtypesController = $controller('EventtypesController as vm', {
            $scope: $scope,
            eventtypeResolve: mockEventtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.eventtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/eventtypes/create');
        }));

        it('should attach an Eventtype to the controller scope', function () {
          expect($scope.vm.eventtype._id).toBe(mockEventtype._id);
          expect($scope.vm.eventtype._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/eventtypes/client/views/form-eventtype.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EventtypesController,
          mockEventtype;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('eventtypes.edit');
          $templateCache.put('modules/eventtypes/client/views/form-eventtype.client.view.html', '');

          // create mock Eventtype
          mockEventtype = new EventtypesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Eventtype Name'
          });

          // Initialize Controller
          EventtypesController = $controller('EventtypesController as vm', {
            $scope: $scope,
            eventtypeResolve: mockEventtype
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:eventtypeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.eventtypeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            eventtypeId: 1
          })).toEqual('/eventtypes/1/edit');
        }));

        it('should attach an Eventtype to the controller scope', function () {
          expect($scope.vm.eventtype._id).toBe(mockEventtype._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/eventtypes/client/views/form-eventtype.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
