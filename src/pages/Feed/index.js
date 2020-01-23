import React ,{ useState , useEffect, useCallback} from 'react';
import { View, FlatList} from 'react-native';
import LazyImage from '../../components/LazyImage'
import { Post, Name, Header, Avatar, Description , Loading} from './styles';

export default function Feed() {
    const [feed, setFeed] = useState([]);
    const [page, setPage] = useState(1)
    const [total,  setTotal] = useState(0)
    const [loading,  setLoading] = useState(false)
    const [refreshing,  setRefreshing] = useState(false)
    const [viewable,  setViewable] = useState('')



    async function refreshList(){
        setRefreshing(true)
        await loadPage(1, true)
        setRefreshing(false)
    }
    const handleViewableChange = useCallback(({changed})=>{
        setViewable(changed.map(({item})=> item.id))

    },[])
    async function loadPage(pageNumber = page, shouldRefresh=false){
        if(total && pageNumber > total) return ;

        setLoading(true);

        console.log(pageNumber);
        const response = await fetch(
            `http://localhost:3000/feed?_expand=author&_limit=5&_page=${pageNumber}`
        )

        const data = await response.json()
        const totalItens = await response.headers.get('X-total-Count')
        
        setTotal(Math.floor(totalItens / 5));
        setFeed(shouldRefresh ? data: [...feed,...data]);
        setPage(pageNumber+1)
        setLoading(false);

    }

    useEffect(()=>{
        
        loadPage();
    },[])
  return (
    <View>
        <FlatList 
            data={feed}
            keyExtractor={post => String(post.id)}
            onEndReached={()=>{loadPage()}}
            onEndReachedThreshold={0.1}
            onRefresh={refreshList}
            refreshing={refreshing}
            onViewableItemsChanged={handleViewableChange}
            ListFooterComponent={loading && <Loading /> }
            viewabilityConfig={{viewAreaCoveragePercentThreshold:20}}
            renderItem={({item}) =>(
                <Post>
                    <Header>
                        <Avatar source={{uri: item.author.avatar}} />
                        <Name>{item.author.name}</Name>
                    </Header>
                    <LazyImage
                        shouldLoad={viewable.includes(item.id)}
                        aspectRatio={parseFloat(item.aspectRatio)}
                        smallSource={{uri:item.small}}
                        source={{uri: item.image}} 
                    />

                    <Description>
                        <Name>{item.author.name} </Name>{item.description}
                    </Description>

                </Post>
            )}

        />
    </View>
  );
}
 