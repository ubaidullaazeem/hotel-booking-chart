(function () {
  'use strict';

  describe('Paymentstatuses Route Tests', function () {
    // Initialize global variables
    var $scope,
      PaymentstatusesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PaymentstatusesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PaymentstatusesService = _PaymentstatusesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('paymentstatuses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/paymentstatuses');
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
          PaymentstatusesController,
          mockPaymentstatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('paymentstatuses.view');
          $templateCache.put('modules/paymentstatuses/client/views/view-paymentstatus.client.view.html', '');

          // create mock Paymentstatus
          mockPaymentstatus = new PaymentstatusesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paymentstatus Name'
          });

          // Initialize Controller
          PaymentstatusesController = $controller('PaymentstatusesController as vm', {
            $scope: $scope,
            paymentstatusResolve: mockPaymentstatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:paymentstatusId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.paymentstatusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            paymentstatusId: 1
          })).toEqual('/paymentstatuses/1');
        }));

        it('should attach an Paymentstatus to the controller scope', function () {
          expect($scope.vm.paymentstatus._id).toBe(mockPaymentstatus._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/paymentstatuses/client/views/view-paymentstatus.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PaymentstatusesController,
          mockPaymentstatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('paymentstatuses.create');
          $templateCache.put('modules/paymentstatuses/client/views/form-paymentstatus.client.view.html', '');

          // create mock Paymentstatus
          mockPaymentstatus = new PaymentstatusesService();

          // Initialize Controller
          PaymentstatusesController = $controller('PaymentstatusesController as vm', {
            $scope: $scope,
            paymentstatusResolve: mockPaymentstatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.paymentstatusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/paymentstatuses/create');
        }));

        it('should attach an Paymentstatus to the controller scope', function () {
          expect($scope.vm.paymentstatus._id).toBe(mockPaymentstatus._id);
          expect($scope.vm.paymentstatus._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/paymentstatuses/client/views/form-paymentstatus.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PaymentstatusesController,
          mockPaymentstatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('paymentstatuses.edit');
          $templateCache.put('modules/paymentstatuses/client/views/form-paymentstatus.client.view.html', '');

          // create mock Paymentstatus
          mockPaymentstatus = new PaymentstatusesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Paymentstatus Name'
          });

          // Initialize Controller
          PaymentstatusesController = $controller('PaymentstatusesController as vm', {
            $scope: $scope,
            paymentstatusResolve: mockPaymentstatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:paymentstatusId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.paymentstatusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            paymentstatusId: 1
          })).toEqual('/paymentstatuses/1/edit');
        }));

        it('should attach an Paymentstatus to the controller scope', function () {
          expect($scope.vm.paymentstatus._id).toBe(mockPaymentstatus._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/paymentstatuses/client/views/form-paymentstatus.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
