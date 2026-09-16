	ELSE IF(@mode='GETPRODUCTLIST')
		BEGIN
			SET @SQL  =''
			SET @SQL1 =''
			SET @SQL2 =''	
			SET @SQL3 =''
			SET @SQL4 =''
			SET @SQL5 =''
			SET @SQL6 =''
			SET @SQL7 =''
			SET @SQL8 =''
			SET @SQL9=''
			set @DwtWh =''			
			Print concat('--@Shape:',@Shape)
			--isnull(@F_Min_DiaWeight,0)<>0 and
			if(isnull(@F_Min_DiaWeight,0)>=0 and isnull(@F_Max_DiaWeight,0)>0)
			begin		
				set @DwtWh=concat('and isnull(totaldiamondweight,0)>=',isnull(@F_Min_DiaWeight,0),' and isnull(totaldiamondweight,0)<=',isnull(@F_Max_DiaWeight,0))
			end
		

			SET @SQL='
				'+IIF(convert(varchar(10),isnull(@IsStockWebsite,0))='1'
							,'
				declare @DefCustId int=0
			
				select top 1 
					@DefCustId=isnull(id,0)
				from ['+@DBNAME+'].[dbo].Usermanagement_systemloginmaster with (NoLock)
				where isDefaultCustomer=1
				','')+'

			

				DECLARE @FromDate1 AS DATETIME= isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate())
				DECLARE @FromDate2 AS DATETIME=convert(nvarchar(50),@FromDate1,106) +''  00:00:00''
						
				'
			--,case when IIF(isnull(D.Frontend1_moveToStoreDate,'''') >= DATEADD(month, -6, @FromDate1),''1'',''0'')=''1'' 
			--					and isnull(NoOfTimeSold,0) >= 5 
			--				then 1 else 0 end as IsBestSeller
			--,case when IIF(isnull(D.Frontend1_moveToStoreDate,'''') >= DATEADD(month, -3, @FromDate1),''1'',''0'')=''1''
			--					and (isnull(D.[Frontend1_QuickLookViewCnt],0) >= 5
			--						or isnull(D.[Frontend1_WishListedCnt],0) >= 3
			--						or isnull([NoOfTimeInQuote],0) >= 2	
			--						)
			--				then 1 else 0 end as IsTrending
			set @SQL1='
				;with DESMST as (
					select
						D.*
						,id as [0]
						,_IsBestSeller as IsBestSeller
						,case when _IsBestSeller=0 then _IsTrending else 0 end as IsTrending
						,case when _IsBestSeller=0 and (case when _IsBestSeller=0 then _IsTrending else 0 end)=0 then _IsNewArrival else 0 end as IsNewArrival
					from 
					(	
						select 
							EntryDate
							,FrontEnd1_newArrivalsto
							,D.id as id
							,case when NoOfTimeSold>= 5 
								then 1 else 0 end as _IsBestSeller
							,isnull(NoOfTimeSold,0) as SoldCnt
							,case when (D.[Frontend1_QuickLookViewCnt]>= 5
									or D.[Frontend1_WishListedCnt]>= 3
									or [NoOfTimeInQuote] >= 2	
									)
							then 1 else 0 end as _IsTrending
							,isnull(D.[Frontend1_QuickLookViewCnt],0)+isnull(D.[Frontend1_WishListedCnt],0)+isnull(NoOfTimeInQuote,0) as TrendCnt
							,D.designno
							,D.autocode as autocode
							,IIF(isnull(D.Frontend1_newArrivalsto,dateadd(dd,-1,@FromDate1))<@FromDate2,''0'',''1'') as _IsNewArrival
							,isnull(D.TitleLine,'''') as [13] --TitleLine
							,isnull(D.diamondquality,'''') as [14] --diamondquality												
							,isnull(D.diamondcolorname,'''') as [17] --diamondcolorname
							,isnull(D.colorstonequality,'''') as [18] --colorstonequality
							,isnull(D.colorstonecolorname,'''') as [19] --colorstonecolorname
							,isnull(D.DisplayOrder,0) as DisplayOrder												
							,ISNULL(description,'''') as [53] -- description						
					'
			set @SQL3= '
						from
						(
							select
								id,autocode,EntryDate ,FrontEnd1_newArrivalsto,NoOfTimeSold,Frontend1_QuickLookViewCnt,Frontend1_WishListedCnt
								,NoOfTimeInQuote,designno,MetalWeight,totaldiamondweight,diamondquality
								,TitleLine,diamondcolorname,colorstonequality,colorstonecolorname,MasterManagement_labid,DisplayOrder
								,FrontEnd1_OrderCnt,design_Hashtagid,description,totalcolorstonepcs,fancystoneshapeEcat_name
								,similarband,DefaultSize
							from ['+@DBNAME+'].dbo.[designmanagement_design] as D with (NoLock)
							where IsEcatalogPublish=1							
								and isactive=1
								'+@FilWH+'							
								'+iif(@autocode<>'','and autocode='''+@autocode+'''','') +'						
								and isnull(mastermanagement_goldtypename,'''')<>''''
								and isnull(FRONTEND1_VisibleTo,'''')<>''''
								'+@PackFil+'
								and (Frontend1_ActiveUpto IS NULL OR Frontend1_ActiveUpto >= @FromDate1)
								'+@DwtWh+'
								'+iif(@WhExc='','',concat(' and ',@WhExc))+'
						) as D				
					'				
			set @SQL4= '
						'+@AlbumJoin+'
					) as D	
				),
				'
		
		
		
			set @TBLName=concat(@Laboursetid,'_',@diamondpricelistname,'_',@colorstonepricelistname,'_',@SettingPriceUniqueNo)


			SET @SQL5='
				
					DESART as 
					(
						select ArticleNo,autocode,MetalTypeId,MetalColorId,NetWeight,GrossWeightWithLoss 
							,DiamondWeightWithLoss,TotalDiamondPcs,ActualColorStoneWeight,TotalMetalCost
							,TotalMakingCost,TotalDiamondCost,TotalDiaSettingCost,TotalColorStoneCost,TotalCSSettingCost
							,TotalMiscCost,TotalOtherCost,TotalColorStonePcs,TotalUnitCost,UnitCostWithmarkup,IsMrpBase						
						from ['+@DBNAME+'].dbo.ArticleManagement_DesignInfo_Web_Product_'+@TBLName+' as d with (NoLock)						
					)

					select
						*
					into PList_'+@RandomNo+'_1
					from 
					(
						select 
							ROW_NUMBER () over ('+IIF(convert(varchar(10),isnull(@IsSortPrice,0))='1','order by id',@SortBy)+') as SrNo
							,a.id
							,a.id as DesignId
							,IsBestSeller
							,IsTrending
							,d.ArticleNo
							,a.designno
							,a.autocode
							,IsNewArrival as IsNewArrival
							,[13] as TitleLine
							,DisplayOrder
							,0 as IsInReadyStock
							,[53] as description
							,a.EntryDate
							,FrontEnd1_newArrivalsto
							,d.IsMrpBase
							,iif(isnull([14],'''')<>'''',concat([14],'','',[17]),'''') as DiaQuaCol
							,iif(isnull([18],'''')<>'''',concat([18],'','',[19]),'''') as CsQuaCol
							,SoldCnt						
							,NetWeight as Nwt	
							,GrossWeightWithLoss as Gwt
							,DiamondWeightWithLoss as Dwt
							,TotalDiamondPcs as Dpcs
							,ActualColorStoneWeight as CSwt
							,TotalColorStonePcs as CSpcs
							,TotalUnitCost as UnitCost
							,UnitCostWithmarkup as UnitCostWithMarkUp
							,UnitCostWithmarkup as UnitCostWithMarkUpIncTax
							,TotalMetalCost as Metal_Cost
							,TotalMakingCost as Labour_Cost
							,TotalDiamondCost as Diamond_Cost
							,TotalDiaSettingCost as Diamond_SettingCost
							,TotalColorStoneCost as ColorStone_Cost
							,TotalCSSettingCost as ColorStone_SettingCost
							,TotalMiscCost as Misc_Cost
							,0 as Misc_SettingCost
							,TotalOtherCost as Other_Cost
							,0 as SolPrice						
							,d.MetalTypeId as MetalPurityid						
							,d.MetalColorId as MetalColorid
						from DESMST as a with (NoLock)
						inner join DESART as d with (NoLock)
							on a.autocode=d.autocode
					) as a
					'
			SET @SQL6='				
					select
						a.*
						,M.id as MetalTypeid
						,concat(metaltypename,'' '',metalPurity) as MetalTypePurity
						,isnull(b.CartId,0) as CartId
						,isnull(b.IsInWish,0) as IsInWish
						,isnull(b.IsInCart,0) as IsInCart					
						,isnull(c.ImageCount,0) as ImageCount
						,isnull(c.ColorImageCount,0) as ColorImageCount
						,isnull(c.[360ImageCount],0) as [360ImageCount]
						,isnull(c.VideoCount,0) as VideoCount
						,isnull(c.ImageExtension,'''') as ImageExtension
						,isnull(c.[360ImageExtension],'''') as [360ImageExtension]
						,isnull(c.VideoExtension,'''') as VideoExtension
						,isnull(c.IsImageNameWithRandNo,0) as IsImageNameWithRandNo
						,isnull(c.ImageVideoDetail,0) as ImageVideoDetail
					from
					(
						select *						
						from PList_'+@RandomNo+'_1 with (NoLock)
						'+@WhPag+'					
					) as a				
					left outer join (
								select 
									max(iif(isnull(IsWishList,0)=0,id,0)) as CartId
									,iif(sum(iif(IsWishList=1,1,0))>0,1,0) as IsInWish
									,iif(sum(iif(isnull(IsWishList,0)=0,1,0))>0,1,0) as IsInCart
									,autocode
									,ArticleNo
								from ['+@DBNAME+'].dbo.B2C_designmanagement_CartList with (NoLock)
								where Usermanagement_systemloginmasterid='+convert(varchar(10),isnull(@Customerid,0))+'
									and isnull(IsPLW,0)='+convert(varchar(10),isnull(@IsPLW,0))+'
								group by autocode,ArticleNo
							) as b
						on a.autocode=b.autocode and a.ArticleNo=b.ArticleNo
					left outer join (
								select 
									 ImageCount
									,ColorImageCount
									,[360ImageCount]
									,VideoCount
									,ImageExtension
									,[360ImageExtension]
									,VideoExtension
									,IsImageNameWithRandNo
									,autocode
									,ImageVideoDetail
								from ['+@ImageDbName+'].dbo.ImageManagement_Design_Image with (NoLock)
							) as c
						on a.autocode=c.autocode
					left outer join ['+@DBNAME+'].dbo.Mastermanagement_metaltype as M with (NoLock)
						on a.MetalPurityid=m.autocode
					order by SrNo
				
					select
						count([id]) as designcount
						,'''' as AutoCodeList					
					from PList_'+@RandomNo+'_1 with (NoLock)
			
				'

			print(@SQL)
			print(@SQL1)
			print(@SQL2)
			print(@SQL3)
			print(@SQL4)
			print(@SQL5)
			print(@SQL6)
			print(@SQL7)
			print(@SQL8)
			print(@SQL9)

			exec(@SQL
				+ @SQL1
				+ @SQL2
				+ @SQL3
				+ @SQL4
				+ @SQL5
				+ @SQL6
				+ @SQL7
				+ @SQL8
				+ @SQL9
				)
		
			if(@IsFromDesDet=1 and isnull(@AlbumName,'')<>'')
			begin
				SET @SQL1='
					declare @AlbumMasterid int=0
							,@Designid int=0
							,@Albumcode nvarchar(200)=''''
							,@CustomerId int='+convert(nvarchar(50),@CustomerId)+'
				
					set @CustomerId=isnull((select top 1 id from ['+@DBNAME+'].dbo.Usermanagement_systemloginmaster with (NoLock)
							where id=@CustomerId),0)
				
					if(@CustomerId>0)
					begin
						select top 1 
							@AlbumMasterid=id
						from ['+@DBNAME+'].dbo.AlbumManagement_AlbumMaster with (NoLock)
						where albumName='''+replace(cast(@AlbumName as NVARCHAR(100)),'''','''''')+'''
				
						if(isnull(@AlbumMasterid,0)>0)
						begin
							select top 1 
								@Designid=DesignId
							from PList_'+@RandomNo+'_1 with (NoLock)
					
							if(isnull(@Designid,0)>0)
							begin							
								if not exists (
									select 1 
									from ['+@DBNAME+'].dbo.[AlbumManagement_Album_CustomerEmail_Bind] with (NoLock) 
									where [AlbumManagement_AlbumMasterid]=@AlbumMasterid
										and [Usermanagement_systemloginmasterid]=@CustomerId
										and albumcode=@Albumcode
								)
								begin
									INSERT INTO ['+@DBNAME+'].dbo.[AlbumManagement_Album_CustomerEmail_Bind]
									(
										[AlbumManagement_AlbumMasterid]
										,[EntryDate],[Usermanagement_systemloginmasterid]
										,[Usermanagement_systemloginmasteruserid],[Mastermanagement_roleid]
										,[firstname],[middlename],[lastname],[email1],[email2],[email3],[email4],[email5]
										,[email6],[email7],[email8],[email9],[email10],[SalesRep_systemloginmasterid]
										,[SalesRep_systemloginmasteruserid],[SalesRep_firstname],[SalesRep_middlenamename]
										,[SalesRep_lastnamename],[SalesRep_email1],[loginuserid],customercode
										,salesrep_designationid,salesrep_designationname,albumcode,RandomNo
									)
									select
										@AlbumMasterid as AlbumManagement_AlbumMasterid
										,isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate()) as EntryDate
										,a.id as Usermanagement_systemloginmasterid
										,a.userid as Usermanagement_systemloginmasteruserid
										,mastermanagement_roleid as Mastermanagement_roleid 		
										,a.firstname as firstname
										,a.middlename as middlename
										,a.lastname as lastname		
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail1],0)=1,isnull(a.[email1],''''),''''),isnull(a.[email1],'''')) AS [email1]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail2],0)=1,isnull(a.[email2],''''),''''),isnull(a.[email2],'''')) AS [email2]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail3],0)=1,isnull(a.[email3],''''),''''),isnull(a.[email3],'''')) AS [email3]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail4],0)=1,isnull(a.[email4],''''),''''),isnull(a.[email4],'''')) AS [email4]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail5],0)=1,isnull(a.[email5],''''),''''),isnull(a.[email5],'''')) AS [email5]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail6],0)=1,isnull(a.[email6],''''),''''),isnull(a.[email6],'''')) AS [email6]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail7],0)=1,isnull(a.[email7],''''),''''),isnull(a.[email7],'''')) AS [email7]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail8],0)=1,isnull(a.[email8],''''),''''),isnull(a.[email8],'''')) AS [email8]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail9],0)=1,isnull(a.[email9],''''),''''),isnull(a.[email9],'''')) AS [email9]
										,iif(isnull(a.mastermanagement_roleid,0)=4,iif(isnull(a.[IsVerifiedEmail10],0)=1,isnull(a.[email10],''''),''''),isnull(a.[email10],'''')) AS [email10]
										,Usermanagement_salesrepid as [SalesRep_systemloginmasterid]
										'
				SET @SQL2='
										,b.userid as [SalesRep_systemloginmasteruserid]
										,b.firstname as [SalesRep_firstname]
										,b.middlename as [SalesRep_middlenamename]
										,b.lastname as [SalesRep_lastnamename]
										,firstVerifiedEmail as [SalesRep_email1]
										,@CustomerId as [loginuserid]									
										,a.customercode
										,b.designationid as salesrep_designationid
										,b.designation as salesrep_designationname
										,@Albumcode as albumcode
										,'''+convert(nvarchar(100),@RandomNo1)+''' as RandomNo									
									from
									(
										select 
											id,userid,customercode,firstname,middlename,lastname,email1,email2,email3,email4,email5,email6,email7,email8,email9,email10
											,Usermanagement_salesrepid,mastermanagement_roleid,mobileno,IsVerifiedsms_mobile1,IsVerifiedsms_mobile2,IsVerifiedsms_mobile3
											,IsVerifiedsms_mobile4,IsVerifiedsms_mobile5,IsVerifiedsms_mobile6,IsVerifiedsms_mobile7,IsVerifiedsms_mobile8,IsVerifiedsms_mobile9
											,IsVerifiedsms_mobile10,sms_mobile1,sms_mobile2,sms_mobile3,sms_mobile4,sms_mobile5,sms_mobile6,sms_mobile7,sms_mobile8,sms_mobile9
											,sms_mobile10,IsVerifiedEmail1,IsVerifiedEmail2,IsVerifiedEmail3,IsVerifiedEmail4,IsVerifiedEmail5,IsVerifiedEmail6,IsVerifiedEmail7
											,IsVerifiedEmail8,IsVerifiedEmail9,IsVerifiedEmail10,mobileno_verified
										from ['+@DBNAME+'].dbo.[usermanagement_systemloginmaster] as a with (NoLock)
										where id=@CustomerId
									) as a			
									left outer join (
												select id,userid,firstname,middlename,lastname,designationid,designation 
														,(case when IsVerifiedEmail1 = 1 then email1
																		when IsVerifiedEmail2 = 1 then email2
																		when IsVerifiedEmail3 = 1 then email3
																		when IsVerifiedEmail4 = 1 then email4
																		when IsVerifiedEmail5 = 1 then email5
																		when IsVerifiedEmail6 = 1 then email6
																		when IsVerifiedEmail7 = 1 then email7
																		when IsVerifiedEmail8 = 1 then email8
																		when IsVerifiedEmail9 = 1 then email9
																		when IsVerifiedEmail10 = 1 then email10
																		else ''''
																		end ) as firstVerifiedEmail
												from ['+@DBNAME+'].dbo.[Usermanagement_systemloginmaster] as b with (NoLock) 
												where mastermanagement_roleid=3
											) as b
										on a.Usermanagement_salesrepid=b.id	
								end
								'
				SET @SQL3='
								declare @designbindid int=0

								set @designbindid=isnull((
									select top 1 id 
									from ['+@DBNAME+'].dbo.[AlbumManagement_Album_CustomerEmail_design_Bind] with (NoLock)
									where AlbumManagement_AlbumMasterid=@AlbumMasterid
										and isnull(Usermanagement_systemloginmasterid,0)=@CustomerId
										and designmanagement_designid=@Designid
										and isnull(albumcode,'''')=@Albumcode
										),0)
		
								if(isnull(@designbindid,0)=0)
								BEGIN						
									insert into ['+@DBNAME+'].dbo.[AlbumManagement_Album_CustomerEmail_design_Bind]
										(
										[AlbumManagement_AlbumMasterid]
										,[EntryDate]
										,[Usermanagement_systemloginmasterid]
										,[designmanagement_designid]
										,[designno]
										,[albumcode]
										,totalview
										,[loginuserid]
										,autocode
									)
									select 
										 @AlbumMasterid as [AlbumManagement_AlbumMasterid]
										,isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate()) as [EntryDate]
										,@CustomerId as [Usermanagement_systemloginmasterid]
										,id as [designmanagement_designid]
										,designno as [designno]
										,@Albumcode as [albumcode]
										,1 as totalview
										,@CustomerId as [loginuserid]
										,autocode as autocode
									from ['+@DBNAME+'].dbo.[designmanagement_design] with (NoLock)
									where id=@Designid							
								'
				SET @SQL4='
								end
								else
								begin
									update a
										set totalview=ISNULL(totalview,0)+1
									from ['+@DBNAME+'].dbo.[AlbumManagement_Album_CustomerEmail_design_Bind] as a with (NoLock)		
									where id=@designbindid							
								end

								update a
									set a.TotalView=b._totalview
								from
								(
									select
										TotalView
										,[AlbumManagement_AlbumMasterid]
										,[Usermanagement_systemloginmasterid]
									from ['+@DBNAME+'].dbo.AlbumManagement_Album_CustomerEmail_Bind as a with (NoLock)
									where [AlbumManagement_AlbumMasterid]=@AlbumMasterid
											and [Usermanagement_systemloginmasterid]=@CustomerId
											and isnull(albumcode,'''')=@Albumcode
								) as a
								left outer join (
										select sum(isnull(totalview,0)) as _totalview
											,[AlbumManagement_AlbumMasterid] as _AlbumMasterid
											,[Usermanagement_systemloginmasterid] as _CustomerId
										from ['+@DBNAME+'].dbo.AlbumManagement_Album_CustomerEmail_design_Bind with (NoLock)	
										where [AlbumManagement_AlbumMasterid]=@AlbumMasterid
											and [Usermanagement_systemloginmasterid]=@CustomerId
											and isnull(albumcode,'''')=@Albumcode					
										group by [AlbumManagement_AlbumMasterid],[Usermanagement_systemloginmasterid]
									) as b
									on a.[AlbumManagement_AlbumMasterid]=b._AlbumMasterid
										and a.Usermanagement_systemloginmasterid=b._CustomerId
							end
						end
					end
				'
				print (@SQL1)
				print (@SQL2)
				print (@SQL3)
				print (@SQL4)
				exec (@SQL1+@SQL2+@SQL3+@SQL4)
			end
		END
		ELSE IF(@mode='GETPRODUCTFULLLIST')
		BEGIN
			print '----------------------'
			SET @SQL  =''
			SET @SQL1 =''
			SET @SQL2 =''	
			SET @SQL3 =''
			SET @SQL4 =''
			SET @SQL5 =''
			SET @SQL6 =''
			SET @SQL7 =''
			SET @SQL8 =''
			SET @SQL9=''
			set @DwtWh=''	
			Print concat('--@Shape:',@Shape)
			--isnull(@F_Min_DiaWeight,0)<>0 and
		
			IF OBJECT_ID('tempdb..#TBL_PList') IS NOT NULL
				DROP TABLE #TBL_PList;


			SET @SQL='
				'+IIF(convert(varchar(10),isnull(@IsStockWebsite,0))='1'
							,'
				declare @DefCustId int=0
			
				select top 1 
					@DefCustId=isnull(id,0)
				from ['+@DBNAME+'].[dbo].Usermanagement_systemloginmaster with (NoLock)
				where isDefaultCustomer=1
				','')+'

			

				DECLARE @FromDate1 AS DATETIME= isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate())
				DECLARE @FromDate2 AS DATETIME=convert(nvarchar(50),@FromDate1,106) +''  00:00:00''
						
				'
			--,case when IIF(isnull(D.Frontend1_moveToStoreDate,'''') >= DATEADD(month, -6, @FromDate1),''1'',''0'')=''1'' 
			--					and isnull(NoOfTimeSold,0) >= 5 
			--				then 1 else 0 end as IsBestSeller
			--,case when IIF(isnull(D.Frontend1_moveToStoreDate,'''') >= DATEADD(month, -3, @FromDate1),''1'',''0'')=''1''
			--					and (isnull(D.[Frontend1_QuickLookViewCnt],0) >= 5
			--						or isnull(D.[Frontend1_WishListedCnt],0) >= 3
			--						or isnull([NoOfTimeInQuote],0) >= 2	
			--						)
			--				then 1 else 0 end as IsTrending
			set @SQL1='
				;with DESMST as (
					select
						D.*
						,id as [0]
						,_IsBestSeller as IsBestSeller
						,case when _IsBestSeller=0 then _IsTrending else 0 end as IsTrending
						,case when _IsBestSeller=0 and (case when _IsBestSeller=0 then _IsTrending else 0 end)=0 then _IsNewArrival else 0 end as IsNewArrival
					from 
					(	
						select 
							EntryDate
							,FrontEnd1_newArrivalsto
							,D.id as id
							,case when NoOfTimeSold>= 5 
								then 1 else 0 end as _IsBestSeller
							,isnull(NoOfTimeSold,0) as SoldCnt
							,case when (D.[Frontend1_QuickLookViewCnt]>= 5
									or D.[Frontend1_WishListedCnt]>= 3
									or [NoOfTimeInQuote] >= 2	
									)
							then 1 else 0 end as _IsTrending
							,isnull(D.[Frontend1_QuickLookViewCnt],0)+isnull(D.[Frontend1_WishListedCnt],0)+isnull(NoOfTimeInQuote,0) as TrendCnt
							,D.designno
							,D.autocode as autocode
							,IIF(isnull(D.Frontend1_newArrivalsto,dateadd(dd,-1,@FromDate1))<@FromDate2,''0'',''1'') as _IsNewArrival
							,isnull(D.TitleLine,'''') as [13] --TitleLine
							,isnull(D.diamondquality,'''') as [14] --diamondquality												
							,isnull(D.diamondcolorname,'''') as [17] --diamondcolorname
							,isnull(D.colorstonequality,'''') as [18] --colorstonequality
							,isnull(D.colorstonecolorname,'''') as [19] --colorstonecolorname
							,isnull(D.DisplayOrder,0) as DisplayOrder												
							,ISNULL(description,'''') as [53] -- description
							,mastermanagement_jewellaryTypeid as product_typeid
							,mastermanagement_collectionid as [collectionid]
							,mastermanagement_categoryid as categoryid
							,mastermanagement_subcategoryid as sub_categoryid
							,mastermanagement_brandid as brandid
							,mastermanagement_genderid as genderid
							,mastermanagement_ocassionid as occasionid
							,mastermanagement_themeid as Styleid
							,mastermanagement_maketypeid as make_typeid
							,mastermanagement_jewellaryType as [product_type]
							,mastermanagement_collectionname as [collection]
							,mastermanagement_categoryname as [category] 
							,mastermanagement_subcategoryname as [sub_category]
							,mastermanagement_brandname as [brand] 
							,mastermanagement_gendername as [gender]
							,mastermanagement_ocassionname as [occasion]
							,mastermanagement_themename as [Style]
							,mastermanagement_maketypename as [make_type]
					'
			set @SQL3= '
							,isnull(FRONTEND1_VisibleTo,'''') as PackageIdList
							,isnull(ExclusiveCustomerId,'''') as ExclusiveCustomerId
						from ['+@DBNAME+'].dbo.[designmanagement_design] as D with (NoLock)
						where IsEcatalogPublish=1							
							and isactive=1							
							and isnull(mastermanagement_goldtypename,'''')<>''''
							and isnull(FRONTEND1_VisibleTo,'''')<>''''
							and (Frontend1_ActiveUpto IS NULL OR Frontend1_ActiveUpto >= @FromDate1)
					'				
			set @SQL4= '					
					) as D	
				),
				'
		
		
		
			set @TBLName=concat(@Laboursetid,'_',@diamondpricelistname,'_',@colorstonepricelistname,'_',@SettingPriceUniqueNo)

			SET @SQL5='
				
					DESART as 
					(
						select ArticleNo,autocode,MetalTypeId,MetalColorId,NetWeight,GrossWeightWithLoss 
							,DiamondWeightWithLoss,TotalDiamondPcs,ActualColorStoneWeight,TotalMetalCost
							,TotalMakingCost,TotalDiamondCost,TotalDiaSettingCost,TotalColorStoneCost,TotalCSSettingCost
							,TotalMiscCost,TotalOtherCost,TotalColorStonePcs,TotalUnitCost,UnitCostWithmarkup,IsMrpBase						
						from ['+@DBNAME+'].dbo.ArticleManagement_DesignInfo_Web_Product_'+@TBLName+' as d with (NoLock)						
					)

					select
						*
					into #TBL_PList
					from 
					(
						select 
							ROW_NUMBER () over ('+IIF(convert(varchar(10),isnull(@IsSortPrice,0))='1','order by id',@SortBy)+') as SrNo
							,a.id
							,a.id as DesignId
							,IsBestSeller
							,IsTrending
							,d.ArticleNo
							,a.designno
							,a.autocode
							,product_typeid
							,collectionid
							,categoryid
							,sub_categoryid
							,brandid
							,genderid
							,occasionid
							,Styleid
							,make_typeid
							,[product_type]
							,[collection]
							,[category] 
							,[sub_category]
							,[brand] 
							,[gender]
							,[occasion]
							,[Style]
							,[make_type]
							,IsNewArrival as IsNewArrival
							,[13] as TitleLine
							,DisplayOrder
							,0 as IsInReadyStock
							,[53] as description
							,a.EntryDate
							,FrontEnd1_newArrivalsto
							,d.IsMrpBase
							,iif(isnull([14],'''')<>'''',concat([14],'','',[17]),'''') as DiaQuaCol
							,iif(isnull([18],'''')<>'''',concat([18],'','',[19]),'''') as CsQuaCol
							,SoldCnt						
							,NetWeight as Nwt	
							,GrossWeightWithLoss as Gwt
							,DiamondWeightWithLoss as Dwt
							,TotalDiamondPcs as Dpcs
							,ActualColorStoneWeight as CSwt
							,TotalColorStonePcs as CSpcs
							,TotalUnitCost as UnitCost
							,UnitCostWithmarkup as UnitCostWithMarkUp
							,UnitCostWithmarkup as UnitCostWithMarkUpIncTax
							,TotalMetalCost as Metal_Cost
							,TotalMakingCost as Labour_Cost
							,TotalDiamondCost as Diamond_Cost
							,TotalDiaSettingCost as Diamond_SettingCost
							,TotalColorStoneCost as ColorStone_Cost
							,TotalCSSettingCost as ColorStone_SettingCost
							,TotalMiscCost as Misc_Cost
							,0 as Misc_SettingCost
							,TotalOtherCost as Other_Cost
							,0 as SolPrice						
							,d.MetalTypeId as MetalPurityid						
							,d.MetalColorId as MetalColorid
							,PackageIdList
							,ExclusiveCustomerId
						from DESMST as a with (NoLock)
						inner join DESART as d with (NoLock)
							on a.autocode=d.autocode
					) as a
					'
			SET @SQL6='				
					select
						a.*
						,M.id as MetalTypeid
						,concat(metaltypename,'' '',metalPurity) as MetalTypePurity
						,isnull(b.CartId,0) as CartId
						,isnull(b.IsInWish,0) as IsInWish
						,isnull(b.IsInCart,0) as IsInCart					
						,isnull(c.ImageCount,0) as ImageCount
						,isnull(c.ColorImageCount,0) as ColorImageCount
						,isnull(c.[360ImageCount],0) as [360ImageCount]
						,isnull(c.VideoCount,0) as VideoCount
						,isnull(c.ImageExtension,'''') as ImageExtension
						,isnull(c.[360ImageExtension],'''') as [360ImageExtension]
						,isnull(c.VideoExtension,'''') as VideoExtension
						,isnull(c.IsImageNameWithRandNo,0) as IsImageNameWithRandNo
						,isnull(c.ImageVideoDetail,0) as ImageVideoDetail
					from
					(
						select *						
						from #TBL_PList with (NoLock)					
					) as a				
					left outer join (
								select 
									max(iif(isnull(IsWishList,0)=0,id,0)) as CartId
									,iif(sum(iif(IsWishList=1,1,0))>0,1,0) as IsInWish
									,iif(sum(iif(isnull(IsWishList,0)=0,1,0))>0,1,0) as IsInCart
									,autocode
									,ArticleNo
								from ['+@DBNAME+'].dbo.B2C_designmanagement_CartList with (NoLock)
								where Usermanagement_systemloginmasterid='+convert(varchar(10),isnull(@Customerid,0))+'
									and isnull(IsPLW,0)='+convert(varchar(10),isnull(@IsPLW,0))+'
								group by autocode,ArticleNo
							) as b
						on a.autocode=b.autocode and a.ArticleNo=b.ArticleNo
					left outer join (
								select 
									 ImageCount
									,ColorImageCount
									,[360ImageCount]
									,VideoCount
									,ImageExtension
									,[360ImageExtension]
									,VideoExtension
									,IsImageNameWithRandNo
									,autocode
									,ImageVideoDetail
								from ['+@ImageDbName+'].dbo.ImageManagement_Design_Image with (NoLock)
							) as c
						on a.autocode=c.autocode
					left outer join ['+@DBNAME+'].dbo.Mastermanagement_metaltype as M with (NoLock)
						on a.MetalPurityid=m.autocode
					order by SrNo
				
					select
						count([id]) as designcount
						,'''' as AutoCodeList					
					from #TBL_PList with (NoLock)
			
				'

			print(@SQL)
			print(@SQL1)
			print(@SQL2)
			print(@SQL3)
			print(@SQL4)
			print(@SQL5)
			print(@SQL6)
			print(@SQL7)
			print(@SQL8)
			print(@SQL9)

			exec(@SQL
				+ @SQL1
				+ @SQL2
				+ @SQL3
				+ @SQL4
				+ @SQL5
				+ @SQL6
				+ @SQL7
				+ @SQL8
				+ @SQL9
				)
		
			IF OBJECT_ID('tempdb..#TBL_PList') IS NOT NULL
				DROP TABLE #TBL_PList;
		END






        -- HERE IS THE   THE SIGEL WHEI CLIKC ON L5 IN LOCAL 
        --@id : 
--@mode : GETPRODUCTLIST
--@y : {{nzen}}{{20}}{{demostore}}{{demostore}}
--@appuserid : neha@gmail.com
--@IPAddress : 103.206.139.196
--@FormName : onlogin (GETPRODUCTLIST)
--@Authorization : 4739220851010810
--@domain : 
--@version : NXTA
--@p :{"PackageId":10,"autocode":"","FrontEnd_RegNo":"80kgizbiduw5e7gg","Customerid":10,"designno":"","Shape":"","FilterKey":"brand","FilterVal":"Jewellery","FilterKey1":"","FilterVal1":"","FilterKey2":"","FilterVal2":"","SearchKey":"","PageNo":1,"PageSize":10,"Metalid":3,"DiaQCid":"2,10","CsQCid":"27,12","Collectionid":"","Categoryid":"","SubCategoryid":"","Brandid":"","Genderid":"","Ocassionid":"","Themeid":"","Producttypeid":"","Min_DiaWeight":"","Max_DiaWeight":"","Min_GrossWeight":"","Max_GrossWeight":"","Min_NetWt":"","Max_NetWt":"","FilPrice":"","CurrencyRate":1,"SortBy":"Recommended","Laboursetid":24,"diamondpricelistname":"testing","colorstonepricelistname":"testing","SettingPriceUniqueNo":8,"IsStockWebsite":1,"Size":"","IsFromDesDet":"","IsPLW":0,"DomainForNo":0,"AlbumName":"","TaxId":4,"WebDiscount":5,"IsZeroPriceProductShow":0,"IsSolitaireWebsite":1}
--@WebDiscount:5.000
--@orderno:
declare @PackageListId nvarchar(500)='0'

					select 
						@PackageListId=concat(id,iif(isnull(IncludePackageid,'')<>'',concat(',',IncludePackageid),'')) 
					from [demostore].[dbo].product_packageMaster with (NoLock)
					where id=10			
					
--@DiaQCid:2,10
--@PriceWh:
--@F_Min_GrossWeight:0.000
--@F_Max_GrossWeight:0.000
--@F_Min_NetWt:0.000
--@F_Max_NetWt:0.000
--@F_Min_DiaWeight:0.000
--@F_Max_DiaWeight:0.000
--11
--step-1 variable declared
--@mode:GETPRODUCTLIST
--@Shape:

			
			declare @DefCustId int=0
			
			select top 1 
				@DefCustId=isnull(id,0)
			from [demostore].[dbo].Usermanagement_systemloginmaster with (NoLock)
			where isDefaultCustomer=1
			

			

			DECLARE @FromDate1 AS DATETIME= isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate())
			DECLARE @FromDate2 AS DATETIME=convert(nvarchar(50),@FromDate1,106) +'  00:00:00'
						
			

			;with DESMST as (
				select
					D.*
					,id as [0]
					,_IsBestSeller as IsBestSeller
					,case when _IsBestSeller=0 then _IsTrending else 0 end as IsTrending
					,case when _IsBestSeller=0 and (case when _IsBestSeller=0 then _IsTrending else 0 end)=0 then _IsNewArrival else 0 end as IsNewArrival
				from 
				(	
					select 
						EntryDate
						,FrontEnd1_newArrivalsto
						,D.id as id
						,case when NoOfTimeSold>= 5 
							then 1 else 0 end as _IsBestSeller
						,isnull(NoOfTimeSold,0) as SoldCnt
						,case when (D.[Frontend1_QuickLookViewCnt]>= 5
								or D.[Frontend1_WishListedCnt]>= 3
								or [NoOfTimeInQuote] >= 2	
								)
						then 1 else 0 end as _IsTrending
						,isnull(D.[Frontend1_QuickLookViewCnt],0)+isnull(D.[Frontend1_WishListedCnt],0)+isnull(NoOfTimeInQuote,0) as TrendCnt
						,D.designno
						,D.autocode as autocode
						,IIF(isnull(D.Frontend1_newArrivalsto,dateadd(dd,-1,@FromDate1))<@FromDate2,'0','1') as _IsNewArrival
						,isnull(D.TitleLine,'') as [13] --TitleLine
						,isnull(D.diamondquality,'') as [14] --diamondquality												
						,isnull(D.diamondcolorname,'') as [17] --diamondcolorname
						,isnull(D.colorstonequality,'') as [18] --colorstonequality
						,isnull(D.colorstonecolorname,'') as [19] --colorstonecolorname
						,isnull(D.DisplayOrder,0) as DisplayOrder												
						,ISNULL(description,'') as [53] -- description						
				
 

					from
					(
						select
							id,autocode,EntryDate ,FrontEnd1_newArrivalsto,NoOfTimeSold,Frontend1_QuickLookViewCnt,Frontend1_WishListedCnt
							,NoOfTimeInQuote,designno,MetalWeight,totaldiamondweight,diamondquality
							,TitleLine,diamondcolorname,colorstonequality,colorstonecolorname,MasterManagement_labid,DisplayOrder
							,FrontEnd1_OrderCnt,design_Hashtagid,description,totalcolorstonepcs,fancystoneshapeEcat_name
							,similarband,DefaultSize
						from [demostore].dbo.[designmanagement_design] as D with (NoLock)
						where IsEcatalogPublish=1							
							and isactive=1
							 and D.mastermanagement_brandname='Jewellery' 							
													
							and isnull(mastermanagement_goldtypename,'')<>''
							and isnull(FRONTEND1_VisibleTo,'')<>''
							 and (CHARINDEX(',10,',',' + FRONTEND1_VisibleTo + ',') > 0 or CHARINDEX(',2,',',' + FRONTEND1_VisibleTo + ',') > 0 or CHARINDEX(',1,',',' + FRONTEND1_VisibleTo + ',') > 0)
							and (Frontend1_ActiveUpto IS NULL OR Frontend1_ActiveUpto >= @FromDate1)
							
							 and  (isnull(ExclusiveCustomerId,'')='' or concat(',',ExclusiveCustomerId,',') like '%,10,%')
					) as D				
				

					
				) as D	
			),
			

				
				DESART as 
				(
					select ArticleNo,autocode,MetalTypeId,MetalColorId,NetWeight,GrossWeightWithLoss 
						,DiamondWeightWithLoss,TotalDiamondPcs,ActualColorStoneWeight,TotalMetalCost
						,TotalMakingCost,TotalDiamondCost,TotalDiaSettingCost,TotalColorStoneCost,TotalCSSettingCost
						,TotalMiscCost,TotalOtherCost,TotalColorStonePcs,TotalUnitCost,UnitCostWithmarkup,IsMrpBase						
					from [demostore].dbo.ArticleManagement_DesignInfo_Web_Product_24_testing_testing_8 as d with (NoLock)						
				)

				select
					*
				into PList_46920260915145536447_1
				from 
				(
					select 
						ROW_NUMBER () over (order by DisplayOrder desc,a.EntryDate desc) as SrNo
						,a.id
						,a.id as DesignId
						,IsBestSeller
						,IsTrending
						,d.ArticleNo
						,a.designno
						,a.autocode
						,IsNewArrival as IsNewArrival
						,[13] as TitleLine
						,DisplayOrder
						,0 as IsInReadyStock
						,[53] as description
						,a.EntryDate
						,FrontEnd1_newArrivalsto
						,d.IsMrpBase
						,iif(isnull([14],'')<>'',concat([14],',',[17]),'') as DiaQuaCol
						,iif(isnull([18],'')<>'',concat([18],',',[19]),'') as CsQuaCol
						,SoldCnt						
						,NetWeight as Nwt	
						,GrossWeightWithLoss as Gwt
						,DiamondWeightWithLoss as Dwt
						,TotalDiamondPcs as Dpcs
						,ActualColorStoneWeight as CSwt
						,TotalColorStonePcs as CSpcs
						,TotalUnitCost as UnitCost
						,UnitCostWithmarkup as UnitCostWithMarkUp
						,UnitCostWithmarkup as UnitCostWithMarkUpIncTax
						,TotalMetalCost as Metal_Cost
						,TotalMakingCost as Labour_Cost
						,TotalDiamondCost as Diamond_Cost
						,TotalDiaSettingCost as Diamond_SettingCost
						,TotalColorStoneCost as ColorStone_Cost
						,TotalCSSettingCost as ColorStone_SettingCost
						,TotalMiscCost as Misc_Cost
						,0 as Misc_SettingCost
						,TotalOtherCost as Other_Cost
						,0 as SolPrice						
						,d.MetalTypeId as MetalPurityid						
						,d.MetalColorId as MetalColorid
					from DESMST as a with (NoLock)
					inner join DESART as d with (NoLock)
						on a.autocode=d.autocode
				) as a
				
				
				select
					a.*
					,M.id as MetalTypeid
					,concat(metaltypename,' ',metalPurity) as MetalTypePurity
					,isnull(b.CartId,0) as CartId
					,isnull(b.IsInWish,0) as IsInWish
					,isnull(b.IsInCart,0) as IsInCart					
					,isnull(c.ImageCount,0) as ImageCount
					,isnull(c.ColorImageCount,0) as ColorImageCount
					,isnull(c.[360ImageCount],0) as [360ImageCount]
					,isnull(c.VideoCount,0) as VideoCount
					,isnull(c.ImageExtension,'') as ImageExtension
					,isnull(c.[360ImageExtension],'') as [360ImageExtension]
					,isnull(c.VideoExtension,'') as VideoExtension
					,isnull(c.IsImageNameWithRandNo,0) as IsImageNameWithRandNo
					,isnull(c.ImageVideoDetail,0) as ImageVideoDetail
				from
				(
					select *						
					from PList_46920260915145536447_1 with (NoLock)
					Where SrNo >  0 AND SrNo < 11					
				) as a				
				left outer join (
							select 
								max(iif(isnull(IsWishList,0)=0,id,0)) as CartId
								,iif(sum(iif(IsWishList=1,1,0))>0,1,0) as IsInWish
								,iif(sum(iif(isnull(IsWishList,0)=0,1,0))>0,1,0) as IsInCart
								,autocode
								,ArticleNo
							from [demostore].dbo.B2C_designmanagement_CartList with (NoLock)
							where Usermanagement_systemloginmasterid=10
								and isnull(IsPLW,0)=0
							group by autocode,ArticleNo
						) as b
					on a.autocode=b.autocode and a.ArticleNo=b.ArticleNo
				left outer join (
							select 
								 ImageCount
								,ColorImageCount
								,[360ImageCount]
								,VideoCount
								,ImageExtension
								,[360ImageExtension]
								,VideoExtension
								,IsImageNameWithRandNo
								,autocode
								,ImageVideoDetail
							from [demostore].dbo.ImageManagement_Design_Image with (NoLock)
						) as c
					on a.autocode=c.autocode
				left outer join [demostore].dbo.Mastermanagement_metaltype as M with (NoLock)
					on a.MetalPurityid=m.autocode
				order by SrNo
				
				select
					count([id]) as designcount
					,'' as AutoCodeList					
				from PList_46920260915145536447_1 with (NoLock)
			
			
 
 
 

Completion time: 2026-09-15T14:55:36.5963108+05:30

{
    "Status": "200",
    "Message": "Request processed successfully.",
    "Data": {
        "rd": [
            {
                "SrNo": "1",
                "id": 1694,
                "DesignId": 1694,
                "IsBestSeller": 0,
                "IsTrending": 0,
                "ArticleNo": "FD114005-2573",
                "designno": "FD114005",
                "autocode": "0001695",
                "IsNewArrival": 0,
                "TitleLine": "",
                "DisplayOrder": 16910,
                "IsInReadyStock": 0,
                "description": "",
                "EntryDate": "2024-09-03T16:12:18.887Z",
                "FrontEnd1_newArrivalsto": null,
                "IsMrpBase": 1,
                "DiaQuaCol": "SI,GH",
                "CsQuaCol": "MOP,PNK",
                "SoldCnt": 0,
                "Nwt": 3.058,
                "Gwt": 3.367,
                "Dwt": 0.277,
                "Dpcs": 24,
                "CSwt": 1.27,
                "CSpcs": 1,
                "UnitCost": 100,
                "UnitCostWithMarkUp": 100,
                "UnitCostWithMarkUpIncTax": 100,
                "Metal_Cost": null,
                "Labour_Cost": null,
                "Diamond_Cost": null,
                "Diamond_SettingCost": null,
                "ColorStone_Cost": null,
                "ColorStone_SettingCost": null,
                "Misc_Cost": null,
                "Misc_SettingCost": 0,
                "Other_Cost": null,
                "SolPrice": 0,
                "MetalPurityid": 1,
                "MetalColorid": 2,
                "MetalTypeid": 1,
                "MetalTypePurity": "GOLD 14K",
                "CartId": 0,
                "IsInWish": 0,
                "IsInCart": 0,
                "ImageCount": 2,
                "ColorImageCount": 0,
                "360ImageCount": 0,
                "VideoCount": 0,
                "ImageExtension": "png",
                "360ImageExtension": "",
                "VideoExtension": "",
                "IsImageNameWithRandNo": 0,
                "ImageVideoDetail": "[{\"Nm\":1,\"Ex\":\"png\",\"CN\":\"\",\"TI\":1},{\"Nm\":2,\"Ex\":\"png\",\"CN\":\"\",\"TI\":1}]"
            }
        ],
        "rd1": [
            {
                "designcount": 1,
                "AutoCodeList": ""
            }
        ]
    }
} HERE THE REUSLT 