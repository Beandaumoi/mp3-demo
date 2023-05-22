const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const progress = $('#progress');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audioContent = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
    {
        name: 'Stream Đến Bao Giờ',
        singer: 'Huyr ft Độ Mixi',
        path: './assets/music/song1.mp3',
        image: './assets/img/img1.jpeg'
    },
    {
        name: 'Độ Tộc 2',
        singer: 'Phúc Du ft Pháo ft Masew ft Độ Mixi',
        path: './assets/music/song2.mp3',
        image: './assets/img/img2.jpeg'
    },
    {
        name: 'Querry',
        singer: 'QNT ft Trung Trần ft Nger',
        path: './assets/music/song3.mp3',
        image: './assets/img/img3.jpeg'
    },
    {
        name: 'Say Em',
        singer: 'QNT',
        path: './assets/music/song4.mp3',
        image: './assets/img/img4.jpeg'
    },
    {
        name: 'Va Vào Giai Điệu Này',
        singer: 'Nger',
        path: './assets/music/song5.mp3',
        image: './assets/img/img5.jpeg'
    },
    {
        name: 'Có Chắc Yêu Là Đây',
        singer: 'Sơn Tùng MTP',
        path: './assets/music/song6.mp3',
        image: './assets/img/img6.jpeg'
    },
    {
        name: 'Muộn Rồi Mà Sao Còn',
        singer: 'Sơn Tùng MTP',
        path: './assets/music/song7.mp3',
        image: './assets/img/img7.jpeg'
    },
    {
        name: 'Em Không Đi Đâu',
        singer: 'QNT',
        path: './assets/music/song8.mp3',
        image: './assets/img/img8.jpeg'
    },
    {
        name: 'Say You Do',
        singer: 'Tiên Tiên',
        path: './assets/music/song9.mp3',
        image: './assets/img/img9.jpeg'
    },
    {
        name: 'Cưới Thôi',
        singer: 'Masew ft Bạn nữ giấu tên',
        path: './assets/music/song10.mp3',
        image: './assets/img/img10.jpeg'
    }
],

    render: function(){ 
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                     <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý thu nhỏ/ phóng to CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0? newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth/cdWidth;
        }

        //Xử lý quay CD
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10 giây
            iterations: Infinity
        })

        cdThumbAnimate.pause();


        //Xử lý nút click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                // _this.isPlaying = false;
                // player.classList.remove('playing');
                audio.pause();
            }else{
                // _this.isPlaying = true;
                // player.classList.add('playing');
                audio.play();
            }
        }

        //Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Thanh progress chạy theo tiến trình âm nhạc
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;

            }
        }

        //Xử lý khi tua song
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime; 
        }

        //Xử lý khi next song
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý khi prev song
        prevBtn.onclick = function(){
            if (_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Xử lý bật/tắt repeat song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }

        //Xử lý bật/tắt random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            this.classList.toggle('active', _this.isRandom);
        }

        //Xử lý next khi xong ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();

            }
        }

        //Xử lý song active
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                //Xử lý khi click song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                //Xử lý khi click option
                if(e.target.closest('.option')) {
                  console.log(123)
                }
            }
        }
        
    }, 
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audioContent.src = this.currentSong.path;
    },
    scrollToActiveSong: function(){
        setTimeout(() => {

            if(this.currentIndex ===0 || this.currentIndex ===1 || this.currentIndex ===2){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })

            }else{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }
        }, 300)
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            alert('Bạn đã nghe hết bài mời nghe lại từ bài đầu. Chúc bạn nghe nhạc vui vẻ ^^!',  );
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },  
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        
    },
    randomSong: function(){
        let newIndex = this.currentIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;

        this.loadCurrentSong();
        
    },
    start: function(){
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe xử lý các sự kiện (DOM)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng (User Interface)
        this.loadCurrentSong();

        //Render playlist
        this.render();
    }
};

app.start()