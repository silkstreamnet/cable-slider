module.exports = function(grunt){

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options:{
                banner: '',
                footer: ''
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '',
                footer: ''
            },
            src_files: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['dist/js/<%= pkg.name %>.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('js', ['concat', 'uglify']);

};