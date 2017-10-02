class PackageContainer {
	constructor (container = {}, index) {
		this.name = container.name
		this.index = index || 0
		this.items = container.items.map(item => new ItemClass(...item))
	}

	addItem () {
		this.items.push(new ItemClass())
	}

	removeItem (index) {
		this.items.splice(index, 1)
	}

	getCacheData () {
		return {
			name: this.name,
			items: this.items.map(item => item.getCacheData())
		}
	}

	render () {

	}
}

class PackageContainerList {
	constructor (list) {
		this.dom = $('.packages-list')
		this.list = Array.isArray(list) 
			? list.map((container, index) => new PackageContainer(container, index))
			: []
	}

	add () {
		this.list.push(new PackageContainer())
	}

	remove (index) {
		this.list.splice(index, 1)
	}

	getCacheData () {
		return this.list.map(item => item.getCacheData())
	}

	render () {
		
	}
}

const packagesListController = (function(global) {
	global.cachedPackageList = new PackageContainerList(cachedNeedPreparationList)


})(window)