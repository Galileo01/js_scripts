//不停向上 遍历，得到 元素距离页面顶部的 绝对距离
function getElementTop(element) {
    let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
}
//按照dom 树的结构 获取h1，h2，h3
const element = [...document.querySelectorAll('h1,h2,h3')].filter(ele => getComputedStyle(ele).height.includes('px'));//过滤被display：none 隐藏了的元素
const head = {
    node: document.createElement('section'),
    children: []
}
for (let i = 0; i < element.length; i++) {
    //默认 H1-H2-H3
    const tagNum = element[i].tagName.slice(1);
    const h1 = {
        node: element[i],
        children: [],//子标题
        tag: 'h' + tagNum,//所属的标题 元素名
        top: getElementTop(element[i])

    }
    //收集 子标题元素
    let j = i + 1;
    level1:
    for (; j < element.length; j++) {
        const tempNum = element[j].tagName.slice(1);

        const h2 = {
            node: element[j],
            children: [],
            tag: 'h' + tempNum,
            top: getElementTop(element[j])
        }

        let m = j + 1;
        //收集 h3 元素
        level2:
        for (; m < element.length; m++) {
            const Num = element[m].tagName.slice(1);
            //H3
            if (Num === '3') {

                const h3 = {
                    node: element[m],
                    children: [],
                    tag: 'h' + Num,
                    top: getElementTop(element[m])
                }
                h2.children.push(h3);
            }
            else if (Num === '2')//遇到下一个H2
            {

                break level2;
            }

            else if (Num === '1')//遇到下一个 H1
            {
                h1.children.push(h2);
                break level1;
            }
            // console.log(Num);

        }

        //一个h2的子h3收集完成
        j = m - 1;//因为j会再++,所以少加一
        h1.children.push(h2);
        console.log(tempNum);

    }
    //一个h1 的 子h2收集完成
    i = j;
    head.children.push(h1);
}
console.log(head);
console.log(element);

//开始生成dom 结构
const section = head.node;
let height = 0;//wapper 的宽高用于后面 变化
let width = 0;
const p = document.createElement('p');
p.innerText = '导航';
p.className = 'head';
section.appendChild(p);
section.className = 'aside-ltt';
const wapper = document.createElement('div')
wapper.className = 'wapper';
for (const x of head.children) {
    const wapper1 = document.createElement('div');
    wapper1.className = 'wapper1';
    const ele = document.createElement('p');
    wapper1.appendChild(ele);
    ele.className = x.tag;
    ele.innerText = x.node.innerText;

    ele.addEventListener('click', () => {
        window.scrollTo(0, x.top)
        console.log(x.top);

    })

    //h2
    for (const y of x.children) {
        const wapper2 = document.createElement('div');
        wapper2.className = 'wapper2';
        const ele2 = document.createElement('p');
        ele2.innerText = y.node.innerText;
        ele2.className = y.tag;
        ele2.addEventListener('click', () => {
            window.scrollTo(0, y.top)
        })
        wapper2.appendChild(ele2);
        //h3
        for (const z of y.children) {
            const ele3 = document.createElement('p');
            ele3.innerText = z.node.innerText;
            ele3.className = z.tag;
            ele3.addEventListener('click', () => {
                window.scrollTo(0, z.top)
            })
            wapper2.appendChild(ele3);
        }
        wapper1.appendChild(wapper2);
        // section.appendChild(ele2)
    }
    wapper.appendChild(wapper1);
}
section.appendChild(wapper);

console.log(section);


section.addEventListener('mouseover', () => {
    wapper.style.height = height;
    wapper.style.width = width;

})
section.addEventListener('mouseleave', () => {
    wapper.style.height = '0';
    wapper.style.width = '0';
})

//创建style 元素，添加样式
const style = document.createElement('style');
style.type = 'text/css';
style.innerText = `
.aside-ltt{
    position:fixed;
    left:10px;
    top:50px;
    z-index: 99999;
    background-color:#fff;
    padding:10px;
    border-radius: 4px;
    box-shadow:2px 2px 5px #333333 ;
   
}
.aside-ltt .wapper{
    overflow:hidden;
    transition: all ease-in-out .5s;
}
.aside-ltt p{
    margin-bottom:5px;
}

.aside-ltt .head{
    font-size:14px;
    font-weight: 1000;
    cursor: pointer;
    text-align:center;
}

.aside-ltt p:hover{
    color:#0876e4;
}
.aside-ltt .h1{
    font-size:14px;
    font-weight: 1000;
    cursor: pointer;
}
.aside-ltt .h2{
    font-size:12px;
    font-weight: 400;
    margin-left:10px;
    cursor: pointer;
}
.aside-ltt .h3{
    font-size:10px;
    margin-left:20px;
    cursor: pointer;
}
.btn-ltt{
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: #fff;
    position:fixed;
    left:10px;
    top:50px;
    text-align:center;
    line-height:38px;
    cursor: pointer;
    display:none;
}
`;


document.body.append(section);
document.head.appendChild(style);
//插入 dom 之后获取宽高 用于后面  过度
height = getComputedStyle(wapper).height;
width = getComputedStyle(wapper).width;
//获取到真实的宽高之后就 隐藏
wapper.style.height = '0';
wapper.style.width = '0';