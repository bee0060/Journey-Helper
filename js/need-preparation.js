
function addNeedPreparationItem () {
	needPreparationList.addItem()
	refreshCache()
	needPreparationListController.bootstrap()

}

function clearNeedPreparationList () {
	needPreparationList.clear()
	refreshCache()
	needPreparationListController.bootstrap()
}

function refreshCache () {
	cachedNeedPreparationList = needPreparationList.getCacheData()
	localStorage.setItem('needPreparationList', JSON.stringify(cachedNeedPreparationList))
}

class needPreparationItemClass {
	constructor (name, count, index) {
		this.name = name
		this.count = isNaN(count) ? 0 : Number(count)
		this.index = index || 0
	}

	getCacheData () {
		return Object.assign({}, this)
	}

	changeName (newName) {
		this.name = newName
	}

	addCount () {
		this.count ++
		this.refreshCount()
	}

	minusCount () {
		this.count = Math.max(0, this.count- 1)
		this.refreshCount()
	}

	refreshCount () {
		let itemDOM = $(`.need-preparation-list dd[data-index=${this.index || 0}]`)
		itemDOM.find('[name=prepareCount]').html(`(${this.count})`)
	}

	render () {
		return $(`<dd data-index='${this.index}'>
			<input name='needPreparationItemName' type='text' tabindex='${this.index + 1}' value='${this.name ||''}'>
			<span name='prepareCount'>(${this.count})</span>
			<button name='addPrepareCount'>+</button>
			<button name='minusPrepareCount'>-</button>
			<button name='delPrepare'>x</button>
		</dd>`)
	}
}

class needPreparationListClass {
	constructor (list) {
		this.dom = $('.need-preparation-list')
		this.list = Array.isArray(list) 
			? list.map((item, index) => new needPreparationItemClass(item.name, item.count, index))
			: []

		if (!this.list.length) {
			this.list.push(new needPreparationItemClass())
		}

		this.removeItem = this.removeItem.bind(this)
	}

	getCacheData () {
		return this.list.map(item => item.getCacheData())
	}

	clear () {
		this.list = []
	}

	addItem (item = {}) {
		this.list.push(new needPreparationItemClass(item.name, item.count, this.list.length))
	}

	getItem (index) {
		return this.list[index]
	}

	callItemMethod (index, methodName, args) {
		if (index >=0 && index < this.list.length) {
			let item = this.getItem(index)
			item[methodName].apply(item, args)
		}
		refreshCache()
	}

	removeItem (e) {
		let target = e.target
		let index = needPreparationListController.getItemIndex(target)
		if (this.list.length > 1 && index >=0 && index < this.list.length) {
			this.list.splice(index, 1)
			this.dom.find('dd').eq(index).remove()
		}
		refreshCache()
	}

	render () {
		let needPreparationListDOM = $('.need-preparation-list')
		needPreparationListDOM.find('dd').remove()
		let itemsDOM = this.list.map((item, index) => item.render(index))
		needPreparationListDOM.append(itemsDOM)
	}
}

const needPreparationListController = (function(global) {
	global.needPreparationList = new needPreparationListClass(cachedNeedPreparationList)

	const bootstrap = () => {
		global.needPreparationList.render()
		registerEvents()
	}
	
	const registerEvents = () => {
		let needPreparationListDOM = $('.need-preparation-list')
		needPreparationListDOM
			.off()
			.on('change', '[name=needPreparationItemName]', changePrepareName)
			.on('click', '[name=addPrepareCount]', addPrepareCount)
			.on('click', '[name=minusPrepareCount]', minusPrepareCount)
			.on('click', '[name=delPrepare]', global.needPreparationList.removeItem)
	}

	const changePrepareName = (e) => {
		let target = e.target
		let index = getItemIndex(target)
		global.needPreparationList.callItemMethod(index, 'changeName', [target.value])
	}

	const addPrepareCount = (e) => {
		let target = e.target
		let index = getItemIndex(target)
		global.needPreparationList.callItemMethod(index, 'addCount')
	}

	const minusPrepareCount = (e) => {
		let target = e.target
		let index = getItemIndex(target)
		global.needPreparationList.callItemMethod(index, 'minusCount')
	}

	const getItemIndex = (target) => {
		let relatedDD = $(target).closest('dd')
		let needPreparationListDOM = $('.need-preparation-list')
		let items = needPreparationListDOM.find('dd')
		return items.index(relatedDD)
	}


	return {
		bootstrap: bootstrap,
		getItemIndex: getItemIndex
	}
})(window)
