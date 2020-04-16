// This file was generated by modules-webmake (modules for web) project.
// See: https://github.com/medikoo/modules-webmake

(function (modules) {
	'use strict';

	var resolve, getRequire, wmRequire, notFoundError, findFile
		, extensions = { ".js": [], ".json": [], ".css": [], ".html": [] }
		, envRequire = typeof require === 'function' ? require : null;

	notFoundError = function (path) {
		var error = new Error("Could not find module '" + path + "'");
		error.code = 'MODULE_NOT_FOUND';
		return error;
	};
	findFile = function (scope, name, extName) {
		var i, ext;
		if (typeof scope[name + extName] === 'function') return name + extName;
		for (i = 0; (ext = extensions[extName][i]); ++i) {
			if (typeof scope[name + ext] === 'function') return name + ext;
		}
		return null;
	};
	resolve = function (scope, tree, path, fullPath, state, id) {
		var name, dir, exports, module, fn, found, ext;
		path = path.split('/');
		name = path.pop();
		if ((name === '.') || (name === '..')) {
			path.push(name);
			name = '';
		}
		while ((dir = path.shift()) != null) {
			if (!dir || (dir === '.')) continue;
			if (dir === '..') {
				scope = tree.pop();
				id = id.slice(0, id.lastIndexOf('/'));
			} else {
				tree.push(scope);
				scope = scope[dir];
				id += '/' + dir;
			}
			if (!scope) throw notFoundError(fullPath);
		}
		if (name && (typeof scope[name] !== 'function')) {
			found = findFile(scope, name, '.js');
			if (!found) found = findFile(scope, name, '.json');
			if (!found) found = findFile(scope, name, '.css');
			if (!found) found = findFile(scope, name, '.html');
			if (found) {
				name = found;
			} else if ((state !== 2) && (typeof scope[name] === 'object')) {
				tree.push(scope);
				scope = scope[name];
				id += '/' + name;
				name = '';
			}
		}
		if (!name) {
			if ((state !== 1) && scope[':mainpath:']) {
				return resolve(scope, tree, scope[':mainpath:'], fullPath, 1, id);
			}
			return resolve(scope, tree, 'index', fullPath, 2, id);
		}
		fn = scope[name];
		if (!fn) throw notFoundError(fullPath);
		if (fn.hasOwnProperty('module')) return fn.module.exports;
		exports = {};
		fn.module = module = { exports: exports, id: id + '/' + name };
		fn.call(exports, exports, module, getRequire(scope, tree, id));
		return module.exports;
	};
	wmRequire = function (scope, tree, fullPath, id) {
		var name, path = fullPath, t = fullPath.charAt(0), state = 0;
		if (t === '/') {
			path = path.slice(1);
			scope = modules['/'];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = '/';
			tree = [];
		} else if (t !== '.') {
			name = path.split('/', 1)[0];
			scope = modules[name];
			if (!scope) {
				if (envRequire) return envRequire(fullPath);
				throw notFoundError(fullPath);
			}
			id = name;
			tree = [];
			path = path.slice(name.length + 1);
			if (!path) {
				path = scope[':mainpath:'];
				if (path) {
					state = 1;
				} else {
					path = 'index';
					state = 2;
				}
			}
		}
		return resolve(scope, tree, path, fullPath, state, id);
	};
	getRequire = function (scope, tree, id) {
		var localRequire = function (path) {
			return wmRequire(scope, [].concat(tree), path, id);
		};
		if (envRequire) localRequire.fromParentEnvironment = envRequire;
		return localRequire
	};
	return getRequire(modules, [], '');
})
	({
		"straightedge-fe-core": {
			"lib": {
				"handleInput.js": function (exports, module, require) {
					module.exports = class inputHandelr {
						constructor(target) {
							this.target = target;
						}
						inputChangeEvent = () => {
							return new Promise((resolve, reject) => {
								this.target.addEventListener('change', (event) => {
									console.log(event.target.value);
									this.InputValue = event.target.value;
									resolve(this.InputValue);
									this.destroy();
								});
							});
						}
						destroy = () => {
							this.target.removeEventListener('change', this.inputChangeEvent);
						}
					}
				},
				"straightedge.js": function (exports, module, require) {
					xpath = require('./xpathGenerator');
					inputHandler = require('./handleInput');

					module.exports = class straightEdge {
						ActionList = [];
						constructor(window, callback = null) {

							this.window = window;
							this.window.addEventListener('click', this.eventListener);
							if (callback) {
								this.window.addEventListener('straightedge-push', callback);
							}
						}
						destroy = () => {
							this.window.removeEventListener('click', this.eventListener);
						}
						eventListener = (event) => {
							let currentAction = {};
							switch (event.target.tagName) {
								case 'SELECT': currentAction['selectValue'] = this.handleInput(event.target);
									break;
								case 'INPUT': currentAction['input'] = this.handleInput(event.target);
									break;
							}
							currentAction['path'] = xpath.getElementXPath(event.target);
							currentAction['action'] = 'click';
							// event[path] = path;
							this.pushAction(currentAction);
							return event;
						}
						handleInput = async (target) => {
							let input = new inputHandler(target);
							let value = await input.inputChangeEvent();
							return value;
						}
						pushAction = (currentAction) => {
							let event = new Event('straightedge-push');
							event['currentAction'] = currentAction;
							this.window.dispatchEvent(event);
							this.ActionList.push(currentAction);
						}
						getActionList = () => {
							return this.ActionList;
						}
					}
				},
				"xpathGenerator.js": function (exports, module, require) {
					module.exports = {
						getElementXPath(elt) {
							let path = "";
							for (; elt && elt.nodeType == 1; elt = elt.parentNode) {
								let idx = this.getElementIdx(elt);
								let xname = elt.tagName;
								if (idx > 1) xname += "[" + idx + "]";
								path = "/" + xname + path;
							}

							return path;
						},
						getElementIdx(elt) {
							let count = 1;
							for (let sib = elt.previousSibling; sib; sib = sib.previousSibling) {
								if (sib.nodeType == 1 && sib.tagName == elt.tagName) count++
							}

							return count;
						}

					};
				}
			},
			"main.js": function (exports, module, require) {
				var straightedge = require('./lib/straightedge');


				straightedgefeRunner = class straightedgefe {
					run(window = window, cb = null) {
						if (!cb) {
							cb = (e) => {
								console.log(e);
							}
						}
						this.St = new straightedge(window, cb);
					}
					stop() {

						console.log('stop', this.St.getActionList());
						this.St.destroy();
						delete this.St;
					}
				}
				straightedgefe = new straightedgefeRunner();
			}
		}
	})("straightedge-fe-core/main");