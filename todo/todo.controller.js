(function () {
    'use strict';

    angular
        .module('app')
        .controller('TodoController', TodoController);

        TodoController.$inject = ['UserService', '$rootScope'];
    function TodoController(UserService, $rootScope) {
        var vm = this;
        vm.todoAdd = todoAdd;
        vm.remove = remove;
        vm.update = update;
        vm.updateText = updateText;
        vm.updateUser = updateUser;
        
        initController();
        
        function initController() {
            loadCurrentUser();
        }
        
        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
             .then(function (user) {
                vm.user = user;
                vm.todoList = vm.user.todoList;
             });
        }        


        function todoAdd() {
            vm.todoList.push({todoText:vm.todoInput, done:false});
            vm.todoInput = "";
        };
    
        function remove() {
            var oldList = vm.todoList;
            vm.todoList = [];
            angular.forEach(oldList, function(x) {
                if (!x.done) vm.todoList.push(x);
            });  
        };
        
        function update() {
            var oldList = vm.todoList;
            vm.todoList = [];
            angular.forEach(oldList, function(x) {
                if (!x.done) {
                    vm.todoList.push(x);
                } 
            });
            vm.todoList.push({todoText:vm.todoInput, done:false});
            vm.todoInput = "";
        };
        

        function updateText(updateTodo) {
            vm.todoInput = updateTodo;     
            
            angular.forEach(vm.todoList, function(x) {
                if (x.todoText !== updateTodo ) {
                    x.done = false;
                }  
            });     
        };

        function updateUser() {
            vm.user.todoList= vm.todoList;
            UserService.UpdateTodoList(vm.user)
            .then(function (response) {
                if (!response.success) {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
        
    }

})();