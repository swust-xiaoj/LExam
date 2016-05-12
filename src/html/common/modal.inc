<script id='myModal' type="text/html">
    <div class="modal fade" id="{{id}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
                </div>
                <div class="modal-body">
                {{body}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{{cancelText}}</button>
                    <button type="button" class="btn btn-primary">{{confirmText}}</button>
                </div>
            </div>
        </div>
    </div>
</script>