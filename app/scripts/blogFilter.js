(function () {
    'use strict';

    angular.module('blogFilter', [])
        .filter('dateNew', function () {
            return function (input) {
                if (input == null) {
                    return "";
                }
                return new Date(input);
            }
        })
        .filter('toArray', function () {
            return function (obj) {
                /*
                 * https://github.com/angular/angular.js/issues/1286#issuecomment-14303275
                 */
                if (!(obj instanceof Object)) return obj;
                return _.map(obj, function (val, key) {
                    return Object.defineProperty(val, '$key', {__proto__: null, value: key});
                });
            }
        })
        .filter('propertyExamine', function() {
            return function(obj, property) {
                const array = [];
                const arr2 = [];
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        let object = obj[key];
                        array.push(object);
                    }
                }
                array.forEach(function(ob) {
                    if (ob[property] != null) {
                        arr2.push(ob);
                    }
                });
                return arr2;
            }
        })
        .filter('arrayMake', function () {
            return function(object) {
                let array = [];
                for (let key in object) {
                    if (object.hasOwnProperty(key)) {
                        let obj = object[key].name;
                        // for (var prop in obj) {
                        //     if (obj.hasOwnProperty(prop)) {
                        //         array.push(obj[prop]);
                        //     }
                        // }
                        array.push(obj);
                    }
                }
                return array;
            }
        })
        .filter('orderByFilter', function () {
            return function (items, field, reverse) {
                var filtered = [];
                angular.forEach(items, function (item) {
                    filtered.push(item);
                });
                filtered.sort(function (a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
                if (reverse) {
                    filtered.reverse();
                }
                return filtered;
            }
        })

        .filter('removeSpacesThenLowercase', function () {
            return function (text) {

                var str = text.replace(/\s+/g, '-');
                var str2 = str.replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                return str2.toLowerCase();
            };
        })
        .filter('removeSpaces', function () {
            return function (text) {
                var str = text.replace(/\s+/g, '');
                var string = btoa(str);
                return string.toLowerCase();
            }
        })
        .filter('postFilter', function () {
            return function (input) {
                if (input) {
                    return 'posted';
                }
                else {
                    return 'draft';
                }
            };
        })
        .filter('approveDeny', function() {
            return function(input) {
                if (input) {
                    return 'Un-Approve';
                }
                else {
                    return 'Approve'
                }
            }
        })
        .filter('countiesFilter', function () {
            return function (input) {
                var tmp = [];
                angular.forEach(input, function (value) {
                    if (value != null || value != undefined) {
                        tmp.push(value);
                    }
                });
                return tmp;
            };
        })
	    .filter('firstWord', function () {
		    return function(input) {
			    if(!input) return input;
			    input = input.split(' ');
			    return input[0];
		    };
	    })
        .filter('unique', function () {
            return function (collection, keyname) {
                var output = [],
                    keys = [],
                    found = [];

                if (!keyname) {

                    angular.forEach(collection, function (row) {
                        var is_found = false;
                        angular.forEach(found, function (foundRow) {

                            if (foundRow == row) {
                                is_found = true;
                            }
                        });

                        if (is_found) {
                            return;
                        }
                        found.push(row);
                        output.push(row);

                    });
                }
                else {

                    angular.forEach(collection, function (row) {
                        var item = row[keyname];
                        if (item === null || item === undefined) return;
                        if (keys.indexOf(item) === -1) {
                            keys.push(item);
                            output.push(row);
                        }
                    });
                }

                return output;
            };
        })
        .filter('dated', function () {
            return function (input) {
                //console.log(input);
                //var date = new Date(input);
                //console.log(date);
                return new Date(input);
            }
        })
        .filter('addCounty', function () {
            return function (input) {
                return input + ' County';
            }
        })
        .filter('spaceless', function () {
            return function (input) {
                if (input) {
                    return input.replace(/\s+/g, '+');
                }
            }
        })
        .filter('spaces', function () {
            return function (input) {
                if (input) {
                    return input.replace(/\+/g, ' ');
                }
            }
        })
        .filter('wordCounter', function () {
            return function (value) {
                if (value && (typeof value === 'string')) {
                    return value.trim().split(/\s+/).length;
                } else {
                    return 0;
                }
            };
        })
    .filter('titlecase', function() {
        return function (input) {
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

            input = input.toLowerCase();
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        }
    });


}());
