// TODO: Ask Tim to rewrite this in the future for readability because his current code is doing what exactly?
function fromPath(path) { return { name: path.split(/__+/)[0].split(/[\\/]/).pop().replace(/_/g, ' '), version: path.split(/__+/)[1] }; }
function toPath(nv) { return [ nv.name, nv.version ].join('__').replace(/[^A-Za-z_0-9.]+/g, '_').replace(/___+/g,'__'); }

export { toPath, fromPath };