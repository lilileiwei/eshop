$(function(){
	//商品功能
	var Product = function(id,name,price,img,quantity){
		this.id = id;
		this.name = name;
		this.price = price;
		this.img =img;
		this.quantity = 1;
	};
	var cart ={
		totalQuantity:0,
		totalAmount:0,
		productList:[],
		addCart:function(product){//从商品添加到购物车
			this.productList.push(product);
			this.totalQuantity += product.quantity;
			this.totalAmount += product.quantity * product.price;
			productComp.render();
		},
		removeCart:function(){//从购物车移除商品

		}

	};
	var productComp ={
		$loading : $('#loading'),
		$loadmore :$('#loading-more'),
		$productList :$('#product-list'),
		init:function(){//所有跟事件有关的都放在初始化中
			var _this = this;
			this.loadData();//先加载数据，异步的
			// $('.btn-add-cart').on('click',function(){});//不执行，但也没有错，因为loadData中的ajax请求是异步的，没等dom加载完，事件就要执行了。所以要用事件代理
			this.$productList.on('click','.btn-add-cart',function(){//事件代理
				var product = $(this).parents('.product-item').data('item-data');
				product.quantity = parseInt($(this).prev().val());
				cart.addCart(product);
			});
			this.$loadmore.on('click',function(){
				_this.loadMore();
			});
		},
		render : function(){
			$('.cash').html(cart.totalAmount);
			$('.quantity').html(cart.totalQuantity);
		},
		loadData:function(callback){
			//url=product/get_product
			//var _this = this;
			// this.$loading.show();
			$.get('js/data.json',{},function(data){
				for(var i=0;i< data.length;i++) {
					var product = new Product(data[i].product_id,data[i].product_name,data[i].product_price,data[i].product_img,data[i].product_quantity);
					//var $product =$('<li class="product-item"> <img src="'+product.img+'" alt="">\
                    	//						<div class="product-info">\
                    	//							<h3 class="product-name">'+product.name+'</h3>\
                    	//							<strong class="product-price">$'+product.price+'</strong>\
                    	//							<input type="text" class="amount" value="'+product.quantity+'">\
                    	//							<button class="btn-add-cart">ADD</button>\
                    	//						</div>\
                    	//				</li>');//转义
					var productHtml =template('product_tpl',product);//使用template模板引擎
					var $product = $(productHtml);
					$product.data('item-data',product);
					this.$productList.append($product);

					this.$loading.hide();
					this.$loadmore.show()
                }
				}.bind(this),'json');
				callback&&callback(); //if(callback){ callback(); }
			
		},
		loadMore:function(){
			this.loadData();
		}
	};
	productComp.init();
});