sap.ui.define([
	"sap/m/library",
	"sap/m/Page",
	"sap/m/Button",
	"sap/tnt/NavigationList",
	"sap/tnt/NavigationListItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/NavContainer",
	"sap/m/ScrollContainer",
	"sap/m/CheckBox",
	"sap/m/Text",
	"sap/tnt/ToolHeader",
	"sap/tnt/ToolPage",
	"sap/tnt/ToolHeaderUtilitySeparator",
	"sap/tnt/SideNavigation",
	"sap/m/OverflowToolbarLayoutData",
	"sap/m/OverflowToolbarButton",
	"sap/m/Avatar",
	"sap/m/ToolbarSpacer",
	"sap/ui/Device",
	"sap/m/SearchField",
	"sap/m/Image",
	"sap/m/Title",
	"sap/m/ToolbarSeparator",
	"sap/ui/core/Element"

],
	function (
		mLibrary,
		Page,
		Button,
		NavigationList,
		NavigationListItem,
		JSONModel,
		NavContainer,
		ScrollContainer,
		CheckBox,
		Text,
		ToolHeader,
		ToolPage,
		ToolHeaderUtilitySeparator,
		SideNavigation,
		OverflowToolbarLayoutData,
		OverflowToolbarButton,
		Avatar,
		ToolbarSpacer,
		Device,
		SearchField,
		Image,
		Title,
		ToolbarSeparator,
		Element
	){
		"use strict";

		//shortcuts
		const ButtonType = mLibrary.ButtonType;
		const OverflowToolbarPriority = mLibrary.OverflowToolbarPriority;

		var model = new JSONModel();
		var data = {
			navigation: [{
				title: 'Root Item',
				icon: 'sap-icon://employee',
				expanded: true,
				key: 'rootpage1',
				href: '#/rootpage1',
				items: [{
					title: 'Child Item 1 Child Item 1 Child Item 1 Child Item 1',
					key: 'page1',
					href: '#/page1'
				},  {
						title: 'www.sap.com',
						selectable: false,
						icon: 'sap-icon://building',
						href: 'https://www.sap.com',
						target: '_blank',
						enabled: false
					}, {
					title: 'Child Item 2 (Disabled)',
					enabled: false
				}, {
					title: 'Child Item 3',
					key: 'page2',
					href: '#/page2'
				}, {
					title: 'Child Item 4',
					key: 'page3',
					href: '#/page3'
				}, {
					title: 'www.sap.com',
					selectable: false,
					icon: 'sap-icon://building',
					key: 'fixeditem1',
					href: 'https://www.sap.com',
					target: '_blank'
				}]
			}, {
				title: 'Root Item (Disabled)',
				icon: 'sap-icon://building',
				enabled: false
			}, {
				title: 'Unselectable Root Item 3',
				icon: 'sap-icon://card',
				expanded: false,
				selectable: false,
				items: [{
					title: 'Unselectable Child Item',
					selectable: false
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}, {
					title: 'Child Item'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://action',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item with hidden expander',
				icon: 'sap-icon://action-settings',
				hasExpander: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://activate',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://activities',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://add',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://arobase',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://attachment',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://badge',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://basket',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://bed',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}]
			}, {
				title: 'Root Item',
				icon: 'sap-icon://bookmark',
				expanded: false,
				items: [{
					title: 'Child Item 1'
				}, {
					title: 'Child Item 2'
				}, {
					title: 'Child Item 3'
				}, {
					title: 'www.sap.com',
					selectable: false,
					icon: 'sap-icon://building',
					key: 'fixeditem1',
					href: 'https://www.sap.com',
					target: '_blank'
				}]
			}, {
				title: "Root Item",
				icon: "sap-icon://kpi-managing-my-area",
				items: [
					{ selectable: false, href: "https://sap.com", target: "_blank", title: "External Link", icon: "sap-icon://attachment" },
					{ title: "Child Item" },
					{ title: "Child Item 2" }
				]
			}, {
				title: "Mileage",
				icon: "sap-icon://mileage",
				items: [
					{ selectable: false, href: "https://sap.com", target: "_blank", title: "External Link", icon: "sap-icon://attachment" },
					{ title: "Driven" },
					{ title: "Walked" }
				]
			}
			],
			fixedNavigation: [{
				title: 'Quick Create',
				icon: 'sap-icon://write-new',
				ariaHasPopup: "Dialog",
				design: "Action",
				selectable: false
			}, {
				title: 'Fixed Item 1',
				icon: 'sap-icon://employee',
				key: 'fixeditem',
				href: '#/fixeditem'
			}, {
				title: 'www.sap.com',
				selectable: false,
				icon: 'sap-icon://building',
				key: 'fixeditem1',
				href: 'https://www.sap.com',
				target: '_blank'
			}, {
				title: 'Fixed Item 3',
				icon: 'sap-icon://card'
			}]
		};
		model.setData(data);

		var sideNavigation = new SideNavigation("SNav", {
			width: "30rem",
			expanded: false,
			itemSelect: function (event) {
				navContainer.to(event.getParameter('item').getKey());
			},
			item: new NavigationList("NList", {
				items: {
					template: new NavigationListItem({
						text: '{title}',
						icon: '{icon}',
						enabled: '{enabled}',
						expanded: '{expanded}',
						hasExpander: '{hasExpander}',
						selectable: '{selectable}',
						key: '{key}',
						href: '{href}',
						target: '{target}',
						items: {
							template: new NavigationListItem({
								selectable: '{selectable}',
								text: '{title}',
								key: '{key}',
								href: '{href}',
								enabled: '{enabled}',
								target: '{target}'
							}),
							path: 'items',
							templateShareable : true
						}
					}),

					path: '/navigation'
				}
			}),
			fixedItem: new NavigationList({
				items: {
					template: new NavigationListItem({
						text: '{title}',
						selectable: '{selectable}',
						icon: '{icon}',
						key: '{key}',
						href: '{href}',
						target: '{target}',
						ariaHasPopup: '{ariaHasPopup}',
						design: '{design}'
					}),
					path: '/fixedNavigation'
				}
			})
		}).setModel(model);

		var navContainer = new NavContainer({
			pages: [
				new ScrollContainer('page1', {
					vertical: true,
					height: "100%",
					horizontal: false,
					content: [
						new CheckBox("compactMode", {
							text: "Compact Mode",
							selected: false,
							select: function () {
								const body = document.querySelector("body");
								if (body.classList.contains("sapUiSizeCompact")) {
									body.classList.remove("sapUiSizeCompact");
								} else {
									body.classList.add("sapUiSizeCompact");
								}
							}
						})
					]
				}),
				new ScrollContainer('page2', {
					vertical: true,
					height: "100%",
					horizontal: false,
					content: [
						new Text({
							text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium architecto autem dicta dolor dolores dolorum earum enim error esse eum ex exercitationem explicabo facilis fugit ipsum maiores, necessitatibus nemo nihil numquam odio officiis optio possimus quas qui quod quos, reiciendis similique sunt tempore tenetur ut vitae voluptate. Ab accusantium, aperiam, asperiores dolores fuga id incidunt itaque numquam placeat quidem recusandae veritatis voluptatibus. Delectus, dicta ea harum hic illo necessitatibus nisi odit quidem quo quod. Architecto at delectus error eum laborum modi, necessitatibus optio perspiciatis quaerat quam, quas quo recusandae repellat sed totam, veritatis voluptas voluptatem voluptates. Accusamus aliquid, asperiores assumenda consequuntur corporis cum debitis delectus doloremque earum esse explicabo fugiat id inventore iste laborum modi molestiae neque nihil obcaecati officia omnis porro quae quasi repellat sed sunt suscipit unde vel veritatis voluptatem! Dolor dolorum quis ratione. Aliquam consectetur eius facilis placeat quibusdam sint tenetur. Ab aliquid at, fuga qui quia soluta veritatis. Amet, eius est exercitationem incidunt magnam necessitatibus porro provident quas tempore velit. Aperiam architecto commodi deleniti dicta eius facere nemo possimus sit voluptate voluptatem. Accusamus ad, alias architecto autem blanditiis culpa cumque ea enim ex hic iste laboriosam laborum laudantium magni, maxime minus necessitatibus quibusdam quisquam repudiandae sapiente ullam vel velit. Adipisci aliquid amet, architecto at atque blanditiis corporis cupiditate dolorem ea enim esse ex, illum iste libero, magnam minus molestiae optio porro quaerat sed tempore vero voluptates! A ad alias aspernatur cumque cupiditate dicta doloremque eos ipsam maxime, molestias necessitatibus, nisi nulla quasi, qui quod sed sequi ut veritatis. Culpa et laboriosam maiores nemo nisi odit officiis praesentium. Animi cumque dolore eaque enim eveniet, hic neque omnis quae quo temporibus. Assumenda at aut dicta ducimus eius facere, laudantium maiores minima molestiae quis, quod saepe sint veniam? Ab ad animi architecto aut dolorem, earum ex exercitationem facere illum ipsum nisi officiis ratione repudiandae suscipit voluptas. Animi commodi dolores eveniet facere id nesciunt non provident vero. A adipisci aliquam architecto aspernatur assumenda atque autem blanditiis consequuntur debitis dolorem dolorum ducimus, ea earum eos explicabo fuga iste itaque iure iusto labore laudantium modi nobis pariatur porro quam repellat tempore unde ut voluptatem voluptatum? Doloribus ea eius excepturi explicabo iure molestias odit omnis pariatur qui rem, similique sunt veniam voluptatum. Adipisci aliquam amet aspernatur commodi, corporis cum dolor doloribus dolorum eos eum facere labore magni minus natus nostrum perspiciatis, reiciendis rerum sit soluta tempora tenetur unde vitae voluptatem. Accusantium architecto, dolor earum fuga iure laboriosam natus officiis quod quos, repellendus, soluta ut velit veritatis. Adipisci amet asperiores assumenda blanditiis consectetur consequatur delectus distinctio dolores doloribus eius fugiat harum illum incidunt ipsa iusto labore laboriosam libero maxime minus modi nam nesciunt nobis nulla obcaecati, odio omnis provident quasi qui quidem quod quos repellat sed unde! Ducimus, harum, odio? Accusantium asperiores atque cum cumque dicta distinctio, doloremque doloribus eaque earum enim eveniet expedita facere fugit impedit iure iusto labore libero maiores non odit pariatur possimus quas quibusdam suscipit tempora vel voluptas. Alias asperiores aspernatur aut culpa delectus deserunt dolor dolore eligendi enim ex facilis fugiat id ipsam iste libero modi perferendis placeat quas quisquam quod repudiandae saepe sequi similique tenetur, ut, veniam veritatis vero. Adipisci animi aut consectetur cumque cupiditate dignissimos, dolorem, error excepturi iure laudantium nihil officia porro qui quod sit temporibus voluptate. Ad adipisci aliquam ducimus ea eius eligendi error ipsam maiores natus nemo nesciunt officiis, repellat, soluta? Animi aspernatur autem blanditiis, culpa dolore ducimus eaque eius et exercitationem impedit ipsum magnam modi nostrum odio recusandae rem sint suscipit temporibus veniam vitae. Assumenda dolore illo illum incidunt ipsam modi molestiae necessitatibus odit omnis quam repellendus repudiandae sapiente soluta tempore, temporibus ullam unde vero! Aliquam aperiam aspernatur assumenda autem corporis, dolore doloribus, enim eum, incidunt nemo recusandae repellat unde. Ad aliquid architecto assumenda at beatae, culpa, dolore eaque earum enim excepturi impedit quas rerum, ut. Alias beatae cupiditate eum expedita explicabo harum impedit ipsum labore magni minus mollitia nemo, optio praesentium quod ut. Debitis dolor doloremque ducimus eos eveniet facere itaque minima minus modi ullam? Ad adipisci architecto beatae cum deserunt dolorum eaque ipsam itaque mollitia officia officiis pariatur reiciendis saepe, sint suscipit vero voluptas voluptates? Accusamus cumque debitis deleniti ducimus eum fuga fugit impedit inventore labore laborum laudantium, modi mollitia, numquam quod repudiandae rerum suscipit totam veritatis voluptas voluptatum? A et harum id impedit in, quasi quos saepe! Delectus deserunt eaque eligendi facere fugiat, harum id incidunt ipsum laborum magnam maiores maxime minus mollitia neque nihil nisi obcaecati officia provident qui rem, sequi, soluta tempore unde veniam veritatis vitae voluptate. Animi cum explicabo id molestias optio suscipit unde! Adipisci aperiam corporis cupiditate eligendi eveniet ex, in ipsum laboriosam maiores maxime modi nostrum perferendis perspiciatis porro quae recusandae repellat similique sit unde voluptatibus? Accusamus adipisci alias at autem consectetur dolor eaque facere illo, incidunt iste, itaque, iusto magnam maxime minima natus necessitatibus nesciunt nobis quam quasi quia rem repellat rerum temporibus ullam vel veniam voluptate? Animi, aperiam ea error eveniet inventore iure minima modi, nam obcaecati odit quam voluptatum! Accusantium, adipisci distinctio ducimus id laudantium minus rerum. Aliquam, itaque perferendis? Alias aperiam aut consequatur iste minus mollitia quasi suscipit! Asperiores aut blanditiis consequuntur dolor dolorem, doloremque dolores facere fuga, impedit itaque minus modi nostrum numquam odio perspiciatis quae qui quibusdam quisquam quod recusandae sapiente sint sit sunt tempora tenetur totam ut voluptas. Ab alias, at hic ipsa neque officia quisquam sequi sit sunt vitae voluptas, voluptatum. Amet delectus error explicabo non nulla, odio quae quas quos sint veniam. Ad aut cupiditate distinctio earum, expedita inventore quae quas repellat. Delectus, dicta esse est molestias perferendis sunt veniam. A, accusamus alias aliquam consectetur consequatur delectus dolore eaque exercitationem in incidunt laudantium nobis, quisquam recusandae rem repudiandae velit, vitae voluptates? Aliquam, aliquid corporis cum dolor, eius est eveniet excepturi impedit iusto laborum minus necessitatibus nisi nostrum officiis quidem rem repellat reprehenderit sit temporibus ullam unde veritatis vero voluptas voluptatibus voluptatum. Accusamus asperiores consectetur cumque iste magnam magni mollitia, nam porro quasi qui suscipit, voluptates voluptatum. Amet aspernatur, culpa cum debitis id itaque libero magni minus molestiae quae quas, quasi reprehenderit sit ut velit? Atque blanditiis dolorem et maxime nulla numquam obcaecati perspiciatis quam quisquam ratione reprehenderit sunt totam vel, voluptas voluptates? Accusantium adipisci aliquid assumenda ducimus eos error est exercitationem, ipsum iusto laudantium nisi porro quia, quos saepe sequi sint, vel voluptatum! Autem commodi consequuntur culpa dolore et fugit molestiae, nulla pariatur quae, quia rerum tempore vel. Aperiam, dicta doloribus ex nemo non quidem recusandae suscipit velit. Adipisci alias amet atque consequatur distinctio dolores dolorum iste itaque iure laborum magni minima molestiae nam nisi officia quibusdam, quis similique sint temporibus vitae? Cumque debitis dolore eligendi enim magnam natus quasi quos repudiandae? Ab architecto at atque corporis deleniti dignissimos ea eaque eius eligendi et ex fugiat, incidunt laborum natus necessitatibus obcaecati optio placeat porro quam quas quibusdam quis quod repellat saepe sapiente tempore ut velit. A accusamus assumenda at autem, beatae commodi deleniti doloremque ea fuga fugiat fugit inventore ipsum laborum libero maxime minima molestiae nobis obcaecati omnis optio porro quae, qui ratione repudiandae sapiente sed voluptas! Amet animi, consectetur consequuntur corporis eos error explicabo facere fugit impedit iste laudantium maiores perspiciatis possimus similique soluta. Ab accusamus alias aliquam amet atque cupiditate dignissimos distinctio ea earum et facilis iusto perspiciatis quibusdam quidem quod ratione, sapiente vitae? Assumenda culpa excepturi, facilis fugiat fugit hic, illum inventore libero nulla odit omnis perspiciatis quae quasi, ratione voluptatum! Aspernatur assumenda consectetur dolor dolorem doloribus eum, exercitationem, expedita facilis fugiat hic illo, iusto neque nulla omnis quas quidem quo vitae! Accusamus aspernatur autem dignissimos dolor, ex maxime necessitatibus nisi qui soluta? Ab adipisci consequuntur cupiditate deleniti dolore earum enim eos est facilis fuga fugiat hic illo impedit in ipsa ipsam iure iusto magnam modi nam nemo nobis nostrum odit officia optio quaerat quasi quibusdam, quo recusandae sed, sequi sit tempore tenetur velit veritatis voluptate voluptatibus! Aspernatur assumenda, dolore doloremque facere iure laudantium maxime minus obcaecati perspiciatis porro quaerat quos reiciendis repellendus sint voluptate voluptatem voluptatibus. Architecto, commodi consectetur consequatur cumque dolorem doloribus ducimus eligendi fugiat in inventore itaque iure laborum libero magnam minima minus nam nobis non nulla numquam odio pariatur quis sapiente sint vel. Accusantium ad aliquam autem distinctio dolores error est fugit harum nulla, odit officia pariatur quis ratione rem sunt, temporibus tenetur voluptas voluptate. Eveniet nesciunt quo rem! In molestias, vitae! Assumenda cum cupiditate dolores eveniet sunt! Adipisci eos mollitia non. Accusamus eaque ex illo, mollitia provident quos voluptatibus! Aliquid architecto esse est eum iusto nemo nobis odit rerum. Aliquam asperiores cumque dignissimos ea eos ipsa libero nisi sapiente sunt unde? Esse excepturi harum itaque perferendis quas, quis temporibus. Architecto commodi, debitis dignissimos dolorum eaque exercitationem fuga impedit in ipsam iusto magni maxime mollitia nam nostrum numquam odio perspiciatis quasi quia quidem, sunt suscipit totam vitae voluptate. Aspernatur assumenda beatae consectetur deserunt dolore eligendi est excepturi exercitationem facilis illo ipsum iusto laboriosam molestiae nam neque nobis obcaecati officiis provident quasi quibusdam quisquam ratione reiciendis rem repellendus repudiandae rerum sapiente tempora, velit vitae voluptatem! A amet atque aut consequuntur deserunt, dolores dolorum ducimus excepturi facere fugiat harum in itaque libero, magni minima minus modi necessitatibus officia praesentium quae quasi quo recusandae reiciendis rerum sint tempore totam voluptatum! Dolores earum eos error esse mollitia nam nobis quas voluptates. A id nisi quo reprehenderit similique? Ad, aperiam, architecto autem beatae cumque ex fugiat illum ipsa itaque libero magni, minus molestias mollitia nostrum officiis omnis saepe tenetur vel velit veniam! A accusantium assumenda consectetur consequuntur debitis deleniti deserunt, ducimus ea eaque eligendi est hic illum in incidunt iusto magni minima minus molestias nam, necessitatibus, nisi nobis numquam odio odit porro quaerat quibusdam quidem quos ratione repellat repellendus tenetur voluptate voluptatibus. Adipisci dignissimos molestiae possimus praesentium quo sed sint. Nobis quasi unde ut. Distinctio doloremque, molestias. Accusantium aliquid asperiores consectetur debitis dolorem dolores eaque error illo in inventore itaque iusto labore minima molestiae non numquam, perspiciatis quae qui, reiciendis repudiandae sed tenetur totam, veniam? Aliquid animi architecto consequatur deserunt distinctio maxime quas repellendus? At culpa dolores error exercitationem perspiciatis quo repellat rerum voluptatum. Esse, quas, similique. Aliquid aut deleniti dicta eligendi fugit hic in, inventore omnis perspiciatis quaerat quam voluptates, voluptatum? Aliquid est iusto ut vel! Debitis distinctio dolorum est hic, ipsa mollitia numquam quae recusandae totam vel! Ab aliquid animi blanditiis distinctio, eaque facere harum id officiis placeat quis reiciendis, sapiente tenetur voluptas. Animi atque aut id perspiciatis qui quis? Hic ipsa omnis quod sunt voluptatibus? Ducimus nulla placeat quibusdam? Accusantium aliquam beatae consequuntur dolorem enim expedita ipsum iure maxime minima minus nulla numquam, officia omnis pariatur perferendis possimus qui, sit soluta. Aspernatur beatae doloremque exercitationem facilis fugit nesciunt pariatur placeat provident quidem tempore. In laboriosam qui ullam ut. Accusantium consequatur debitis impedit molestiae officiis pariatur repudiandae velit voluptate? Assumenda autem, delectus fugiat inventore quos reprehenderit voluptate voluptatem. Commodi, eligendi eum inventore officiis qui saepe sit! Accusantium aliquam aperiam aut cum ea eius eveniet ex fugit hic iure minima modi qui quis repellat sequi, ullam voluptas, voluptate. Alias amet consequatur corporis dolor ducimus enim eos error eum excepturi exercitationem expedita harum id iure maxime molestiae necessitatibus nemo nesciunt nulla numquam odit officiis perspiciatis quam quas qui quo quod ratione recusandae reiciendis, saepe sed unde ut velit voluptatem! Architecto culpa cum dolore eveniet fuga libero nemo nihil porro qui, recusandae reprehenderit, tempora unde voluptas? Ab aspernatur consequuntur, dolore doloremque esse illum labore magnam, magni nisi nulla quae quia quos rerum tenetur totam ut voluptatem voluptates? A, aliquid aperiam corporis debitis dolorem et ex exercitationem ipsum molestiae nesciunt numquam quas, ullam voluptates. Distinctio, dolores dolorum ex fuga fugit quam reiciendis rem. Aliquam aliquid amet consequatur eos expedita facere hic itaque labore laboriosam, nobis omnis pariatur repudiandae, temporibus tenetur unde, veniam veritatis. Accusamus accusantium alias animi aperiam atque cum debitis dignissimos dolorem, dolorum eligendi ex explicabo facere inventore ipsum molestiae natus nemo odio optio provident, quam quas quibusdam recusandae repellat saepe tempora vel voluptate. Aliquam atque cum, dolor dolores ea expedita id in ipsa labore maiores nemo nobis pariatur perferendis perspiciatis sed. Expedita, unde?'
						})
					]
				}),
				new ToolPage('page3', {
					mainContents: [
						new Page({
							content: [
								new Text({text: "Main content should NOT have padding left, when there is no SideNavigation"})
							]
						})
					],
					header: [
						new ToolHeader()
					]
				})
			]
		});

		var toolHeader = new ToolHeader('tHeader', {
			content: [
				new Button('menuToggleButton', {
					icon: 'sap-icon://menu2',
					tooltip: 'Menu',
					type: ButtonType.Transparent,
					press: function() {
						var sideExpanded = toolPage.getSideExpanded();

						if (sideExpanded) {
							this.setTooltip('Large Size Navigation');
						} else {
							this.setTooltip('Small Size Navigation');
						}

						toolPage.setSideExpanded(!sideExpanded);
					},
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.NeverOverflow
					})
				}),
				new Image({
					src: "./images/SAP_Logo.png",
					tooltip: "SAP logo",
					press: function () {},
					decorative: false,
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.NeverOverflow
					})
				}),
				new Title({
					id: "productName",
					text: "Product name",
					wrapping: false
				}),
				new Text({
					id: "secondTitle",
					text: "Second title",
					wrapping: false
				}),
				new ToolbarSpacer(),
				new SearchField({
					id: "searchField",
					width: "16rem",
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.Low,
						group: 1
					})
				}),
				new ToolbarSpacer({
					id: "spacer",
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.Low,
						group: 1
					})
				}),
				new Button({
					id: "searchButton",
					tooltip: "Search",
					type: ButtonType.Transparent,
					icon: "sap-icon://search",
					visible: false
				}),
				new OverflowToolbarButton({
					tooltip: "Action 1",
					text: "Action 1",
					type: ButtonType.Transparent,
					icon: "sap-icon://source-code",
					layoutData: new OverflowToolbarLayoutData({
						group: 2
					})
				}),
				new OverflowToolbarButton({
					tooltip: "Action 2",
					text: "Action 2",
					type: ButtonType.Transparent,
					icon: "sap-icon://card",
					layoutData: new OverflowToolbarLayoutData({
						group: 2
					})
				}),
				new ToolbarSeparator({
					layoutData: new OverflowToolbarLayoutData({
						group: 2
					})
				}),
				new OverflowToolbarButton({
					text: "Settings",
					type: ButtonType.Transparent,
					icon: "sap-icon://action-settings"
				}),
				new Button({
					tooltip: "Notifications",
					type: ButtonType.Transparent,
					icon: "sap-icon://bell",
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.NeverOverflow
					})
				}),
				new ToolHeaderUtilitySeparator(),
				new ToolbarSpacer({
					width: "1.125rem"
				}),
				new Avatar({
					tooltip: "Profile",
					src: "images/Woman_avatar_01.png",
					initials: "UI",
					displaySize: "XS",
					press: function () {},
					layoutData: new OverflowToolbarLayoutData({
						priority: OverflowToolbarPriority.NeverOverflow
					})
				})
			]
		});

		if (Device.media.getCurrentRange('StdExt').name === 'Phone' ||
				Device.media.getCurrentRange('StdExt').name === 'Tablet') {
			toolHeader.getAggregation('content')[0].setTooltip('Large Size Navigation');
		}

		var toolPage = new ToolPage({
			header: toolHeader,
			sideContent: sideNavigation,
			mainContents: [navContainer]
		}).placeAt('body');
});