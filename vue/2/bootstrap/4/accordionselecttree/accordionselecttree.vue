<template>
	<div>
		<input	v-model="selectedNodeId"  type="hidden" :id="id" :name="id">
		<div class="accordion" :id="id + 'Accord'">
			<div class="card border-bottom">
				<div class="card-header" :id="id + 'AccordHeading'">
					<h5 class="mb-0">
						<label>{{label}}: </label>
						<button :class="btnCss"  type="button" data-toggle="collapse" data-target="#collapsePortCatTreeAccord" aria-expanded="true" aria-controls="collapseSeo">
							<span v-if="selectedNode">{{ selectedNode[nodeLabelProp] }}</span> 
						</button>
					</h5>
				</div>
				<div id="collapsePortCatTreeAccord" :class="isAccordShow" :aria-labelledby="id + 'AccordHeading'" :data-parent="'#' + id + 'Accord'">
					<div class="card-body">
						<b-tree-view :ref="'v' + id" 
							:data="treedata"
							:contextMenuItems="contextMenuItems" 
							:showIcons="showIcons"
							:defaultIconClass="defaultIconClass"
							:allowMultiple="allowMultiple"
							:nodeKeyProp="nodeKeyProp"
							:nodeChildrenProp="nodeChildrenProp"
							:nodeLabelProp="nodeLabelProp"
							:nodesDraggable="nodesDraggable"
							:contextMenu="contextMenu"
							:renameNodeOnDblClick="renameNodeOnDblClick"
							:prependIconClass="prependIconClass"			
							:iconClassProp="iconClassProp"
							></b-tree-view>
					</div>
					 <transition  name="fade">
						<div v-if="sErrorText" class="alert alert-danger">
							{{sErrorText}}
						</div>
					</transition>
				</div>
			</div>
			<!--label>Ac level
				<input type="text" v-model="selectedNodeId" GUFinput="BUXemit('input', $event.target.value)">
			</label-->
		</div>

	</div>
</template>
<script>
	//Accordion + Tree view componend with send ajax data to server
	import BootstrapVueTreeview from '../bootstrap-vue-treeview/index';
	Vue.use(BootstrapVueTreeview);

	import './css/animerror.css';
	

    export default {
		model: {
			prop: 'value',
			event: 'input'
		},
		props: {
			id: {
				type: String
			},
			value: {
				
			},
			label: {
				type: String
			},
			/** @property field name for parent id */
			nodeParentKeyProp: {
                type: String,
                default: 'parent_id'
			},
			/** @property {String} url post request created new menu item*/
			urlCreateNewItem: {
				type:String,
				default: ''
			},
			/** @property {String} url post request updated (rename) menu item */
			urlUpdateItem: {
				type:String,
				default: ''
			},
			/** @property {String} url post request delete menu item */
			urlRemoveItem: {
				type:String,
				default: ''
			},
			accordisopen: {
				type: Boolean,
				default: false
			},
			//This props will be passed in TreeView
			treedata: {
                type: Array,
                required: true
            },
            allowMultiple: {
                type: Boolean,
                default: false
            },
            nodeKeyProp: {
                type: String,
                default: 'id'
            },
            nodeChildrenProp: {
                type: String,
                default: 'children'
            },
            nodeLabelProp: {
                type: String,
                default: 'name'
            },
            nodesDraggable: {
                type: Boolean,
                default: false
            },
            contextMenu: {
                type: Boolean,
                default: true
			},
			/* Exclude from props
            contextMenuItems: {
                type: Array,
                default: () => {
					return [
						{code: 'ADD_NODE', label: 'Add node'},
						{code: 'RENAME_NODE', label: 'Rename node'},
						{code: 'DELETE_NODE', label: 'Delete node'}
					];
				}
			},*/
            renameNodeOnDblClick: {
                type: Boolean,
                default: true
            },
            // class added to every icon no matter what
            prependIconClass: {
                type: String,
                default: null
            },
            // default icon if node icon is not specified
            defaultIconClass: {
                type: String,
                default: null
            },
            // where to search for node icon
            iconClassProp: {
                type: String,
                default: "icon"
            },
            // show icons
            showIcons: {
                type: Boolean,
                default: false
            }
		},
		watch:{
			value:function(n, old) {
				n = Number(n);
				if (this.skipSelfWatch == true) {
					this.skipSelfWatch = false;
					return;
				}
				if (n != old) {
					this.selectNodeById(n, false);
				}
			}
		},
		computed: {
			isAccordShow:{
				get() {
					let s = 'collapse';
					if (this.accordisopen) {
						return (s + ' show');
					}
					return s;
				}
			},
		},
		name: 'categorytree',
		
        //вызывается раньше чем mounted
        data: function(){return {
			
			/** @property {Object} defaultSelectedNode Значение активной ноды по умолчанию (ничего не выбрано) */
			defaultSelectedNode : {name: this.$t('app.Nothing_select'), id : 0},
			
			/** @property {Object} selectedNode Активная нода */
			selectedNode : this.defaultSelectedNode,

			/** @property {Number} selectedNodeId id активной ноды */
			selectedNodeId : 0,

			/** @property {String} Вид кнопки с именем выбранной категории */
			btnCss : 'btn btn-danger',

			/** @property {Array} contextMenuItems */
			//TODO Писать документацию и публиковать, хватит с ним пока возиться.
			//TODO очень потом сделать всё-таки передачу параметра (тут закомментировать, в props раскомментировать).
			//TODO очень потом Обработчики этих ключей должны эмитировать события во вне, вдруг что-то ещё надо будет.
			contextMenuItems :[
				{code: 'ADD_NODE', label: this.$root.$t('app.Add_node')},
				{code: 'RENAME_NODE', label: this.$root.$t('app.Rename_node')},
				{code: 'DELETE_NODE', label: this.$root.$t('app.Delete_node')}
			],

			/** @property {Array} sErrorText сообщение об ошибке */
			sErrorText : '',
			
		}; },
        //
        methods:{
			selectNodeById(key, recreatNodeMap = true) {
				if (recreatNodeMap) {
					delete this.$refs['v' + this.id].nodeMap;
					this.$refs['v' + this.id].createNodeMap();
				}
				let x = this.$refs['v' + this.id].getNodeByKey(parseInt(key));
				if (x) {
					x.select();
					this.expandBranch(x);
					return true;
				}
				if (this.selectedNode) {
					x = this.$refs['v' + this.id].getNodeByKey(parseInt(this.selectedNode[this.nodeKeyProp]));
					if (x && x.deselect) {
						x.deselect();
					}
				}
				this.selectedNode = this.defaultSelectedNode;
				this.btnCss = 'btn btn-danger';
				return false;
			},
			/**
			 * @param {TreeNode} oNode
			*/
			expandBranch(oNode) {
				oNode.expand();
				let x = this.$refs['v' + this.id].getNodeByKey(parseInt(oNode.data[this.nodeParentKeyProp]));
				while (x) {
					x.expand();
					x = this.$refs['v' + this.id].getNodeByKey(parseInt(x.data[this.nodeParentKeyProp]));
				}
			},
			/**
			 * @description Обработка выбора пункта контекстного меню дерева категорий
			*/
			onSelectTreeViewContextMenuItem(item, node){
				if (item.code == 'ADD_NODE') {
					if (this.nRequestAddNodeId) {
						this.showError(this.$t('app.Add_request_already_sended_wait'));
						return;
					}
					this.showSpinner(node.$el);
					let id = node.data[this.nodeKeyProp];
					this.nRequestAddNodeId = id;
					Rest._post({parent_id : id}, (data) => {this.onSuccessAddNewItem(data); }, this.urlCreateNewItem, (a, b, c) => {this.onFailItemAction(a, b, c);});
				}
			},
			/**
			 * @description Show spinner for add node
			*/
			showSpinner(el) {
				$(el).find('.tree-node').first().append($(`<div role="status" class="spinner-grow small j-node-spinner">
					  <span class="sr-only">Loading...</span>
				</div>`));
			},
			/**
			 * @description Delete spinner for add node
			*/
			deleteSpinner(){
				$('.j-node-spinner').remove();
			},
			/**
			 * @description Processed success add new item
			 * @param {Object} data
			*/
			onSuccessAddNewItem(data) {
				if (!this.onFailItemAction(data)) {
					return;
				}
				delete this.$refs['v' + this.id].nodeMap;
				this.$refs['v' + this.id].createNodeMap();
				
				let x = this.$refs['v' + this.id].getNodeByKey(parseInt(data[this.nodeParentKeyProp]));
				let newNodeData = {};
				newNodeData[this.nodeKeyProp] = data[this.nodeKeyProp];
				newNodeData[this.nodeLabelProp] = data[this.nodeLabelProp];
				newNodeData[this.nodeParentKeyProp] = data[this.nodeParentKeyProp];
				newNodeData.icon = this.defaultIconClass;
				x.appendChild(newNodeData);
				delete this.$refs['v' + this.id].nodeMap;
				this.$refs['v' + this.id].createNodeMap();
			},
			/**
			 * @description default process failure item operations
			 * @param {Object} data
			*/
			onFailItemAction(data, b, c) {
				this.deleteSpinner();
				this.nRequestAddNodeId = 0;
				if (data.status && data.status == 'ok') {
					return true;
				}
				if (data.status && data.status == 'error') {
					if (data.msg) {
						this.showError(data.msg);
						return false;
					}
				} else {
					this.showError(this.$t('app.DefaultError') );
					return false;
				}
				
			},
			/**
			 * @description Send request to server with new item name
			*/
			onRenameTreeViewItem(node) {
				this.showSpinner(node.$el);
				let sendData = {};
				sendData[this.nodeKeyProp] = node.data[this.nodeKeyProp];
				sendData[this.nodeParentKeyProp] = node.data[this.nodeParentKeyProp];
				sendData[this.nodeLabelProp] = node.data[this.nodeLabelProp];
				Rest._post(sendData, (data) => {this.onSuccessRenameItem(data); }, this.urlUpdateItem, (a, b, c) => {this.onFailItemAction(a, b, c);});
			},
			/**
			 * @description On end rename item on server if no rename will show error
			*/
			onSuccessRenameItem(data) {
				if (!this.onFailItemAction(data)) {
					return;
				}
			},
			/**
			 * @description show error create / update items
			 */
			showError(s) {
				setTimeout(() => {
					this.sErrorText = s;
					setTimeout(() => {
						this.sErrorText = '';
					}, 2*1000);
				}, 500);
			},
			/**
			 * @description Processing select tree node
			*/
			onSelectTreeViewItem(node, isSelected) {
				if (isSelected) {
					this.selectedNode = node.data;
					this.btnCss = 'btn btn-success';
					this.selectedNodeId = this.selectedNode[this.nodeKeyProp];
					this.$emit('input', this.selectedNodeId);
					this.skipSelfWatch = true;
				} else if (node.data[this.nodeKeyProp] === this.selectedNode[this.nodeKeyProp]) {
					this.selectedNode = this.defaultSelectedNode;
					this.btnCss = 'btn btn-danger';
					this.selectedNodeId = this.selectedNode[this.nodeKeyProp];
					this.$emit('input', this.selectedNodeId);
					this.skipSelfWatch = true;
				}
			},
			/**
			 * @description Processing delete node (nodes)
			 * @param {TreeNode} node
			 * @param {Array} nodesData (array of objects {this.nodeKeyProp, this.nodeParentKeyProp, this.nodeLabelProp})
			 * @param {Array} idList (array of numbers)
			*/
			onDeleteTreeViewItem(node, nodesData, idList) {
				if (!this.stackremovedItems) {
					//сюда помещаем всех потомков ветки и ветку по id
					this.stackremovedItems = {};
				}
				this.exampleNode = {...node};
				let id = node.data[this.nodeKeyProp], i, currObj;
				for (i = 0; i < nodesData.length; i++) {
					currObj = {...nodesData[i]};
					this.stackremovedItems[ currObj[this.nodeKeyProp] ] = currObj;
				}
				Rest._post({idList:idList}, (data) => {this.onSuccessDeleteItem(data); }, this.urlRemoveItem, (a, b, c) => {this.onFailDeleteItem(a, b, c);});
			},
			/**
			 * @description Restore tree nodes if nodes no removed
			 * @param {Object} data
			*/
			onFailDeleteItem(data, b, c) {
				this.nRequestAddNodeId = 0;
				if (data.status && data.status == 'ok') {
					return true;
				}
				if (data.status && data.status == 'error') {
					if (data.msg) {
						this.showError(data.msg);
						this.restoreAllRemovedItems();
						return false;
					}
				} else {
					this.showError(this.$t('app.DefaultError') );
					this.restoreAllRemovedItems();
					return false;
				}
			},
			/**
			 * @description Clear this.stackremovedItems
			 * @param {Object} data
			*/
			onSuccessDeleteItem(data) {
				if (!this.onFailDeleteItem(data)) {
					return;
				}
				if (data.ids) {
					let i, cid;
					for (i = 0; i < data.ids.length; i++) {
						cid = data.ids[i];
						delete this.stackremovedItems[cid];
						if (cid == this.selectedNode[this.nodeKeyProp]) {
							this.selectedNode = this.defaultSelectedNode;
							this.btnCss = 'btn btn-danger';
						}
					}
				}
			},
			/**
			 * @description Restore tree nodes if nodes no removed
			*/
			restoreAllRemovedItems() {
				let arr = [], i, aTree;
				for (i in this.stackremovedItems) {
					arr.push( this.stackremovedItems[i] );					
				}
				TreeAlgorithms.idFieldName = this.nodeKeyProp;
				TreeAlgorithms.parentIdFieldName = this.nodeParentKeyProp;
				TreeAlgorithms.childsFieldName = this.nodeChildrenProp;
				aTree = TreeAlgorithms.buildTreeFromFlatList(arr, true);
				
				//Restore all tree
				if (!aTree[0][this.nodeParentKeyProp]) {
					this.addNode(aTree[0]);
				} else {
					for (i = 0; i < aTree.length; i++) {
						TreeAlgorithms.walkAndExecuteAction(aTree[i], {context:this, f:this.addNode});
					}
				}
			},
			/**
			 * @description Add node in Tree if it no exists (@see restoreAllRemovedItems)
			 * @param {Object} nodeData
			*/
			addNode(nodeData) {
				//search node in tree
				delete this.$refs['v' + this.id].nodeMap;
				this.$refs['v' + this.id].createNodeMap();
				let parentNode, x = this.$refs['v' + this.id].getNodeByKey(parseInt(nodeData[this.nodeKeyProp]));
				if (x) {
					return;
				}
				//root
				if (!nodeData[this.nodeParentKeyProp] || nodeData[this.nodeParentKeyProp] == 0) {
					this.exampleNode.data = nodeData;
					this.$refs['v' + this.id].data.push(nodeData);
					return;
				}
				//no root
				parentNode = this.$refs['v' + this.id].getNodeByKey(nodeData[this.nodeParentKeyProp]);
				if (parentNode) {
					parentNode.appendChild(nodeData);
				}
			},
			/**
			 * @description Initalize defaultSelectedNode
			*/
			initDefaultSelectedNode() {
				//defaultSelectedNode : {name: this.$t('app.Nothing_select'), id : 0}
				this.defaultSelectedNode = {};
				this.defaultSelectedNode[this.nodeKeyProp] = 0;
				this.defaultSelectedNode[this.nodeLabelProp] = this.$t('app.Nothing_select');
			},
			/**
			 * @description Localize default menu only if it default menu
			*/
			localizeDefaultMenu(){
					this.contextMenuItems = [
						{code: 'ADD_NODE', label: this.$root.$t('app.Add_node')},
						{code: 'RENAME_NODE', label: this.$root.$t('app.Rename_node')},
						{code: 'DELETE_NODE', label: this.$root.$t('app.Delete_node')}
					];
			},
			/**
			 * @description dinamic change selection
			*/
			selectAndExpandNode(recreatNodeMap = true) {
				this.selectNodeById(this.value, recreatNodeMap);
			}
		}, //end methods
        mounted() {
			this.localizeDefaultMenu();
			this.initDefaultSelectedNode();
			

			this.selectAndExpandNode();
			this.$refs['v' + this.id].$on('contextMenuItemSelect', (item, node) => {
                this.onSelectTreeViewContextMenuItem(item, node);
			});
			this.$refs['v' + this.id].$on('nodeSelect', (node, isSelected) => {
                this.onSelectTreeViewItem(node, isSelected);
			});
			this.$refs['v' + this.id].$on('nodeRenamed', (node) => {
                this.onRenameTreeViewItem(node);
			});
			this.$refs['v' + this.id].$on('deleteNodeEx', (node, nodesData, idList) => {
                this.onDeleteTreeViewItem(node, nodesData, idList);
			});
        }
    }
</script>